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
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `다음 텍스트를 분석하여 애매하고 불확실한 표현들을 찾아주세요.

텍스트: "${text}"

다음 카테고리로 분류해주세요:
- hedge: 불확실한 표현 (예: "아마도", "~것 같다", "~할까요?", "~말까" 등)
- vague: 모호한 표현 (예: "좀", "약간", "대충" 등)
- softener: 완곡한 표현 (예: "개인적으로", "혹시" 등)
- apology: 과도한 사과 (예: "죄송하지만", "미안하지만" 등)
- filler: 불필요한 연결어 (예: "아무튼", "근데" 등)

다음 JSON 형식으로 응답해주세요:
{
  "score": 0-100 사이의 명확성 점수 (낮을수록 애매함),
  "highlights": [
    {
      "text": "발견된 애매한 표현",
      "category": "카테고리",
      "reason": "문제가 되는 이유",
      "start": 텍스트에서의 시작 위치,
      "end": 텍스트에서의 끝 위치
    }
  ],
  "categories": ["발견된 카테고리들"],
  "suggestions": ["개선을 위한 구체적인 제안들"]
}

중요: 반드시 유효한 JSON만 응답하고, 다른 설명은 포함하지 마세요.`;

    const result = await model.generateContent(prompt);
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
