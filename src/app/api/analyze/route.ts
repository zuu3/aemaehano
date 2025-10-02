import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { score } from '@/utils/scoring';
import { analyzeWithAI, analyzeWithLocalAI } from '@/services/ai-analysis.service';
import type { AnalysisResult, Hit } from '@/types';

const CATEGORY_REASONS: Record<Hit['cat'], string> = {
  hedge: '불확실한 표현입니다. 단정적으로 서술하세요.',
  vague: '모호한 표현입니다. 구체적으로 명시하세요.',
  softener: '완곡한 표현입니다. 직접적으로 표현하세요.',
  apology: '불필요한 사과 표현입니다. 자신감 있게 작성하세요.',
  filler: '불필요한 연결어입니다. 간결하게 작성하세요.',
};

const CATEGORY_LABELS: Record<Hit['cat'], string> = {
  hedge: '불확실',
  vague: '모호',
  softener: '완곡',
  apology: '과도한 사과',
  filler: '불필요한 표현',
};

function generateSuggestions(score: number, categories: Set<string>): string[] {
  const suggestions: string[] = [];

  if (score >= 80) {
    suggestions.push('✓ 매우 명확한 텍스트입니다!');
  } else if (score >= 60) {
    suggestions.push('비교적 명확한 텍스트이지만 약간의 개선이 가능합니다.');
  } else if (score >= 40) {
    suggestions.push('모호한 표현이 포함되어 있습니다. 구체적인 정보를 추가하세요.');
  } else {
    suggestions.push('많은 모호한 표현이 발견되었습니다. 전반적인 수정이 필요합니다.');
  }

  if (categories.has('hedge')) {
    suggestions.push('• "아마도", "~것 같다" 같은 불확실한 표현을 확실한 표현으로 바꾸세요.');
  }
  if (categories.has('vague')) {
    suggestions.push('• "좀", "약간", "대충" 같은 모호한 표현 대신 구체적인 수치나 기준을 사용하세요.');
  }
  if (categories.has('softener')) {
    suggestions.push('• "개인적으로", "혹시" 같은 완곡한 표현을 제거하고 직접적으로 서술하세요.');
  }
  if (categories.has('apology')) {
    suggestions.push('• 불필요한 사과 표현을 줄이고 자신감 있게 작성하세요.');
  }
  if (categories.has('filler')) {
    suggestions.push('• "아무튼", "근데" 같은 불필요한 연결어를 제거하여 간결하게 만드세요.');
  }

  if (score < 80) {
    suggestions.push('• 구체적인 수치, 날짜, 시간을 사용하면 명확성이 높아집니다.');
    suggestions.push('• 문장 끝을 단정적으로 마무리하면 신뢰감을 줄 수 있습니다.');
  }

  return suggestions;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { text } = await req.json().catch(() => ({}));
  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'text required' }, { status: 400 });
  }

  try {
    const scoreResult = score(text);
    
    console.log('=== Score Result ===');
    console.log('Score:', scoreResult.score);
    console.log('Hits:', scoreResult.hits.length);
    console.log('Breakdown:', scoreResult.breakdown);

    const validScore = isNaN(scoreResult.score) ? 0 : Math.round(scoreResult.score);

    const highlights = scoreResult.hits.map(hit => ({
      start: hit.start,
      end: hit.end,
      category: hit.cat,
      reason: CATEGORY_REASONS[hit.cat],
    }));

    const categoriesSet = new Set(scoreResult.hits.map(hit => hit.cat));
    const categories = Array.from(categoriesSet);

    const basicSuggestions = generateSuggestions(validScore, categoriesSet);
    
    const aiAnalysis = process.env.HUGGINGFACE_API_KEY 
      ? await analyzeWithAI(text)
      : analyzeWithLocalAI(text);
    
    const allSuggestions = [...basicSuggestions, ...aiAnalysis.suggestions];

    const result: AnalysisResult = {
      original_text: text,
      ambiguity_score: validScore,
      highlights,
      categories,
      suggestions: allSuggestions,
    };

    console.log('=== Final Result ===');
    console.log('Ambiguity Score:', result.ambiguity_score);
    console.log('AI Tone:', aiAnalysis.tone);
    console.log('AI Clarity:', aiAnalysis.clarity);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}