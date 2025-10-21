import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import type { Hit, AnalysisMode } from '@/types';
import { getAnalysisPrompt, getImprovementPrompt } from '@/utils/analysisPrompts';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface GeminiAnalysisResult {
  score: number;
  highlights: Array<{
    text: string;
    category: Hit['cat'];
    reason: string;
    start: number;
    end: number;
  }>;
  categories: string[];
  suggestions: string[];
}

export async function analyzeWithGemini(
  text: string,
  mode: AnalysisMode = 'business'
): Promise<GeminiAnalysisResult> {
  try {
    // 텍스트 길이 제한 (약 3000자까지)
    const truncatedText = text.length > 3000 ? text.substring(0, 3000) + '...' : text;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash', // 250회/일 무료
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 4096, // 토큰 한도 증가
        topP: 0.8,
        topK: 40,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });

    // 모드별 프롬프트 가져오기
    const modePrompt = getAnalysisPrompt(mode);

    const prompt = `${modePrompt}

텍스트: "${truncatedText}"

다음 JSON 형식으로만 응답하세요:
{
  "score": 70,
  "highlights": [
    {
      "text": "찾은표현",
      "category": "hedge",
      "reason": "불확실한 표현입니다",
      "start": 5,
      "end": 10
    }
  ],
  "categories": ["hedge", "vague"],
  "suggestions": ["명확하게 수정하세요"]
}

참고:
- score는 0-100 사이 숫자
- highlights는 찾은 모든 문제점 배열
- start/end는 텍스트 내 위치 (인덱스)
- category는 hedge, vague, softener, apology, filler 중 하나
- 다른 설명 없이 JSON만 출력하세요`;

    // 타임아웃 설정 (60초로 증가)
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Gemini API timeout')), 60000);
    });

    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise
    ]);
    const response = await result.response;

    console.log('=== Gemini Response Status ===');
    console.log('Candidates:', response.candidates?.length);
    console.log('PromptFeedback:', response.promptFeedback);

    // Safety rating 체크
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      console.log('Finish Reason:', candidate.finishReason);
      console.log('Safety Ratings:', candidate.safetyRatings);

      // SAFETY로 차단되었는지 확인
      if (candidate.finishReason === 'SAFETY') {
        console.warn('Response blocked by safety filter');
      }
    }

    let responseText = '';
    try {
      responseText = response.text();
    } catch (error) {
      console.error('Error getting response text:', error);
      // text() 메서드 실패 시 candidates에서 직접 추출 시도
      if (response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          responseText = candidate.content.parts[0].text || '';
        }
      }
    }

    console.log('=== Gemini Raw Response ===');
    console.log('Length:', responseText.length);
    console.log('Text:', responseText.substring(0, 200));

    // 빈 응답 체크
    if (!responseText || responseText.trim().length === 0) {
      console.error('Empty response from Gemini');
      console.error('Full response object:', JSON.stringify(response, null, 2));
      throw new Error('Empty response from Gemini API');
    }

    // JSON 파싱 (마크다운 코드블록 제거)
    let jsonText = responseText.trim();

    // ```json ... ``` 형태 제거
    jsonText = jsonText.replace(/^```json?\s*/i, '').replace(/```\s*$/, '');

    // JSON 객체 추출
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in response:', responseText);
      throw new Error('Invalid JSON response from Gemini');
    }

    let analysis: GeminiAnalysisResult;
    try {
      analysis = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Attempted to parse:', jsonMatch[0]);
      throw new Error('Failed to parse JSON from Gemini response');
    }

    // 점수 검증
    analysis.score = Math.max(0, Math.min(100, analysis.score));

    // 데이터 검증
    if (!Array.isArray(analysis.highlights)) {
      analysis.highlights = [];
    }
    if (!Array.isArray(analysis.categories)) {
      analysis.categories = [];
    }
    if (!Array.isArray(analysis.suggestions)) {
      analysis.suggestions = [];
    }

    // 하이라이트 위치 검증 및 수정
    analysis.highlights = analysis.highlights.map(highlight => {
      const highlightText = highlight.text;
      // 원본 텍스트에서 실제 위치 찾기
      const actualStart = text.indexOf(highlightText);

      if (actualStart !== -1) {
        // 실제 위치를 찾았으면 업데이트
        return {
          ...highlight,
          start: actualStart,
          end: actualStart + highlightText.length,
        };
      }

      // 찾지 못했으면 원래 값 사용 (하지만 범위 체크)
      return {
        ...highlight,
        start: Math.max(0, Math.min(highlight.start, text.length)),
        end: Math.max(0, Math.min(highlight.end, text.length)),
      };
    });

    return analysis;
  } catch (error) {
    console.error('Gemini API error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    // 에러 시 기본값 반환
    return {
      score: 50,
      highlights: [],
      categories: [],
      suggestions: ['AI 분석 중 오류가 발생했습니다. 다시 시도해주세요.'],
    };
  }
}

export function isGeminiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

export async function improveTextWithGemini(
  originalText: string,
  mode: AnalysisMode = 'business'
): Promise<string> {
  try {
    // 텍스트 길이 제한
    const truncatedText = originalText.length > 2000 ? originalText.substring(0, 2000) + '...' : originalText;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash', // 250회/일 무료
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 4096, // 토큰 한도 증가
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });

    // 모드별 개선 프롬프트 가져오기
    const improvementGuideline = getImprovementPrompt(mode);

    const prompt = `다음 한국어 텍스트를 개선해주세요.

원본 텍스트: "${truncatedText}"

${improvementGuideline}

개선된 텍스트만 출력하세요. 설명이나 다른 내용은 포함하지 마세요.`;

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Gemini API timeout')), 60000);
    });

    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise
    ]);
    const response = await result.response;

    console.log('=== Improve Text Response Status ===');
    console.log('Candidates:', response.candidates?.length);

    const improvedText = response.text().trim();

    console.log('Improved text length:', improvedText.length);

    // 빈 응답 체크
    if (!improvedText || improvedText.trim().length === 0) {
      console.warn('Empty improved text, returning original');
      return originalText;
    }

    // 따옴표나 마크다운 제거
    let cleaned = improvedText;
    cleaned = cleaned.replace(/^["']|["']$/g, '');
    cleaned = cleaned.replace(/^```.*\n?|```$/g, '');

    return cleaned || originalText;
  } catch (error) {
    console.error('Gemini improve text error:', error);
    // 에러 시 원본 반환
    return originalText;
  }
}
