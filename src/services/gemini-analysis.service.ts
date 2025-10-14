import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Hit } from '@/types';

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

export async function analyzeWithGemini(text: string): Promise<GeminiAnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    const prompt = `다음 한국어 텍스트에서 애매하고 불확실한 표현을 찾아주세요.

텍스트: "${text}"

애매한 표현 카테고리:
1. hedge: 불확실한 표현 (예: 아마도, ~것 같다, ~할까, ~말까)
2. vague: 모호한 표현 (예: 좀, 약간, 어느정도)
3. softener: 완곡한 표현 (예: 개인적으로, 혹시)
4. apology: 불필요한 사과 (예: 죄송, 미안)
5. filler: 불필요한 표현 (예: 아무튼, 근데)

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
- score는 0-100 사이 숫자 (낮을수록 애매함)
- highlights는 찾은 모든 애매한 표현 배열
- start/end는 텍스트 내 위치 (인덱스)
- 다른 설명 없이 JSON만 출력하세요`;

    // 타임아웃 설정 (25초)
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Gemini API timeout')), 25000);
    });

    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise
    ]);
    const response = await result.response;
    const responseText = response.text();

    console.log('=== Gemini Raw Response ===');
    console.log(responseText);

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
