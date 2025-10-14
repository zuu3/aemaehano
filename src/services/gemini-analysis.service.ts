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

    const prompt = `텍스트에서 애매한 표현을 찾아 JSON으로 응답하세요.

텍스트: "${text}"

카테고리:
- hedge: 불확실 (아마도, ~것 같다, ~할까, ~말까)
- vague: 모호 (좀, 약간, 대충)
- softener: 완곡 (개인적으로, 혹시)
- apology: 과도한 사과 (죄송, 미안)
- filler: 불필요 (아무튼, 근데)

JSON 형식:
{
  "score": 0-100,
  "highlights": [{"text":"표현","category":"hedge","reason":"이유","start":0,"end":5}],
  "categories": ["hedge"],
  "suggestions": ["제안"]
}

JSON만 응답:`;

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

    // JSON 파싱
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Gemini');
    }

    const analysis: GeminiAnalysisResult = JSON.parse(jsonMatch[0]);

    // 점수 검증
    analysis.score = Math.max(0, Math.min(100, analysis.score));

    return analysis;
  } catch (error) {
    console.error('Gemini API error:', error);
    // 에러 시 기본값 반환
    return {
      score: 50,
      highlights: [],
      categories: [],
      suggestions: ['Gemini API 오류로 기본 분석을 사용합니다.'],
    };
  }
}

export function isGeminiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}
