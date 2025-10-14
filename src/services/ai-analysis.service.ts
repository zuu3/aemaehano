import { HfInference } from '@huggingface/inference';

export interface AIAnalysisResult {
  confidence: number;
  tone: 'confident' | 'uncertain' | 'neutral';
  clarity: number;
  suggestions: string[];
  context_issues: string[];
  rewriteSuggestions?: RewriteSuggestion[];
}

export interface RewriteSuggestion {
  original: string;
  improved: string;
  reason: string;
}

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function analyzeWithAI(text: string): Promise<AIAnalysisResult> {
  try {
    const [sentimentResult, uncertaintyAnalysis] = await Promise.all([
      analyzeSentimentWithHF(text),
      analyzeUncertaintyLocal(text),
    ]);

    const confidence = Math.round((sentimentResult.score + uncertaintyAnalysis.confidence) / 2);
    const tone = determineTone(sentimentResult, uncertaintyAnalysis);
    const clarity = uncertaintyAnalysis.clarity;

    const suggestions = generateAISuggestions(text, tone, clarity, uncertaintyAnalysis);
    const context_issues = uncertaintyAnalysis.issues;

    const rewriteSuggestions = await generateRewriteSuggestions(text);

    return { confidence, tone, clarity, suggestions, context_issues, rewriteSuggestions };
  } catch (error) {
    console.error('AI 분석 실패, 로컬 분석 사용:', error);
    return analyzeWithLocalAI(text);
  }
}

async function analyzeSentimentWithHF(text: string) {
  try {
    const result = await hf.textClassification({
      model: 'nlptown/bert-base-multilingual-uncased-sentiment',
      inputs: text,
    });

    const topResult = result[0];
    const stars = parseInt(topResult.label.split(' ')[0]);
    const score = (stars / 5) * 100;
    
    return {
      label: stars >= 4 ? 'positive' : stars <= 2 ? 'negative' : 'neutral',
      score: score,
    };
  } catch (error) {
    console.error('HF Sentiment 분석 실패:', error);
    return { label: 'neutral', score: 50 };
  }
}

function analyzeUncertaintyLocal(text: string) {
  const uncertainWords = [
    '아마', '것 같', '듯', '혹시', '조만간', '적당히', 
    '좀', '약간', '대충', '나중에', '언젠가', '그쪽', '여기저기'
  ];
  const confidentWords = ['확실히', '반드시', '명확히', '정확히', '구체적으로', '분명히'];
  
  const uncertainCount = uncertainWords.filter(w => text.includes(w)).length;
  const confidentCount = confidentWords.filter(w => text.includes(w)).length;
  
  const confidence = Math.max(0, Math.min(100, 70 - uncertainCount * 12 + confidentCount * 8));
  const clarity = Math.max(0, 100 - uncertainCount * 15);
  
  const issues: string[] = [];
  if (text.length < 20) {
    issues.push('문장이 너무 짧아 문맥 파악이 어렵습니다.');
  }
  if (uncertainCount > 3) {
    issues.push('불확실한 표현이 과도하게 많습니다.');
  }

  return { confidence, clarity, issues, uncertainCount, confidentCount };
}

function determineTone(
  hfResult: { label: string; score: number },
  localAnalysis: { uncertainCount: number; confidentCount: number }
): 'confident' | 'uncertain' | 'neutral' {
  if (localAnalysis.uncertainCount > 2) {
    return 'uncertain';
  }
  
  if (localAnalysis.confidentCount > 1) {
    return 'confident';
  }

  if (hfResult.score > 75) {
    return 'confident';
  } else if (hfResult.score < 40) {
    return 'uncertain';
  }
  
  return 'neutral';
}

async function generateRewriteSuggestions(text: string): Promise<RewriteSuggestion[]> {
  const suggestions: RewriteSuggestion[] = [];
  
  const vaguePatterns = [
    { pattern: /조만간/g, examples: ['3월 15일', '이번 주 금요일', '2주 내'] },
    { pattern: /그쪽|저쪽|여기/g, examples: ['서울 본사', '강남 사무실', '회의실 A'] },
    { pattern: /적당히|대충/g, examples: ['정확히', '꼼꼼히', '상세히'] },
    { pattern: /좀|약간/g, examples: ['10% 정도', '소량', '일부'] },
    { pattern: /나중에|언젠가/g, examples: ['다음 주', '6월 중', '분기 내'] },
    { pattern: /아마(?:도)?/g, examples: ['확실히', '분명히', ''] },
    { pattern: /것\s*같(?:다|아요|습니다)/g, examples: ['입니다', '됩니다', '합니다'] },
  ];

  for (const { pattern, examples } of vaguePatterns) {
    const matches = text.match(pattern);
    if (matches) {
      for (const match of matches) {
        const replacement = examples[Math.floor(Math.random() * examples.length)];
        
        suggestions.push({
          original: match,
          improved: replacement,
          reason: getReasonForReplacement(match),
        });
      }
    }
  }

  if (suggestions.length > 0) {
    let improvedText = text;
    for (const { original } of suggestions) {
      const replacement = suggestions.find(s => s.original === original)?.improved || original;
      improvedText = improvedText.replace(original, replacement);
    }
    
    if (improvedText !== text) {
      suggestions.push({
        original: text,
        improved: improvedText,
        reason: '모든 애매한 표현을 구체적으로 개선한 완성본입니다',
      });
    }
  }

  return suggestions.slice(0, 5);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function rewriteTextWithAI(text: string): Promise<string> {
  try {
    const prompt = `Improve this unclear Korean sentence to be more clear and specific. Remove vague expressions.\n\nOriginal: ${text}\n\nImproved:`;
    
    const result = await hf.textGeneration({
      model: 'facebook/mbart-large-50-many-to-many-mmt',
      inputs: prompt,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.7,
        return_full_text: false,
      },
    });
    let improved = result.generated_text.trim();
    improved = improved.replace(/^Improved:|^개선:|^답:/g, '').trim();
    
    return improved || '';
  } catch (error) {
    console.error('AI 재작성 실패 (정상 - 로컬 제안 사용):', error);
    return '';
  }
}

function getReasonForReplacement(vagueTerm: string): string {
  const reasons: Record<string, string> = {
    '조만간': '구체적인 날짜나 기간으로 명시하세요 (예: 3월 15일, 이번 주 내)',
    '그쪽': '정확한 장소를 지정하세요 (예: 서울 본사, 2층 회의실)',
    '저쪽': '정확한 장소를 지정하세요 (예: 서울 본사, 2층 회의실)',
    '여기': '정확한 장소를 지정하세요 (예: 본사 1층, 강남 사무실)',
    '적당히': '명확한 기준이나 방법을 제시하세요 (예: 정확히, 상세히)',
    '대충': '명확한 기준이나 방법을 제시하세요 (예: 꼼꼼히, 정밀하게)',
    '좀': '구체적인 양이나 정도를 명시하세요 (예: 10%, 약간)',
    '약간': '구체적인 양이나 정도를 명시하세요 (예: 15% 정도, 소량)',
    '나중에': '구체적인 시기를 명시하세요 (예: 다음 주, 6월 중)',
    '언젠가': '구체적인 시기를 명시하세요 (예: 올해 안, 하반기)',
    '아마': '불확실한 추측을 제거하고 확실한 정보만 전달하세요',
    '아마도': '불확실한 추측을 제거하고 확실한 정보만 전달하세요',
  };

  // 부분 매칭
  for (const [key, reason] of Object.entries(reasons)) {
    if (vagueTerm.includes(key)) {
      return reason;
    }
  }

  if (vagueTerm.includes('것') && vagueTerm.includes('같')) {
    return '단정적인 표현으로 바꾸세요 (예: ~입니다, ~됩니다)';
  }

  return '더 명확하고 구체적인 표현으로 바꾸세요';
}

function generateAISuggestions(
  text: string,
  tone: 'confident' | 'uncertain' | 'neutral',
  clarity: number
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  , analysis: any
): string[] {
  const suggestions: string[] = [];

  if (tone === 'uncertain') {
    suggestions.push('🤖 AI 분석: 전체적인 톤이 불확실합니다. "확실히", "명확히" 같은 강한 표현을 사용하세요.');
  } else if (tone === 'confident') {
    suggestions.push('✨ AI 분석: 자신감 있는 톤이 감지되었습니다!');
  }

  if (clarity < 50) {
    suggestions.push('🤖 AI 분석: 명확성이 매우 낮습니다. 구체적인 예시와 데이터를 추가하세요.');
  } else if (clarity < 70) {
    suggestions.push('🤖 AI 분석: 일부 모호한 표현이 있습니다. 더 직접적으로 표현하세요.');
  }

  const hasNumbers = /\d/.test(text);
  
  if (!hasNumbers && text.length > 50) {
    suggestions.push('🤖 AI 제안: 구체적인 수치나 날짜를 추가하면 신뢰도가 크게 향상됩니다.');
  }

  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0);
  if (sentences.length > 1) {
    const avgLength = text.length / sentences.length;
    if (avgLength > 80) {
      suggestions.push('🤖 AI 제안: 문장이 너무 깁니다. 짧고 간결한 문장으로 나누세요.');
    }
  }

  return suggestions;
}

export function analyzeWithLocalAI(text: string): AIAnalysisResult {
  const uncertainWords = ['아마', '것 같', '듯', '혹시', '조만간', '적당히', '좀', '약간'];
  const confidentWords = ['확실히', '반드시', '명확히', '정확히', '구체적으로'];
  
  const uncertainCount = uncertainWords.filter(w => text.includes(w)).length;
  const confidentCount = confidentWords.filter(w => text.includes(w)).length;
  
  let tone: 'confident' | 'uncertain' | 'neutral' = 'neutral';
  let confidence = 50;
  
  if (uncertainCount > confidentCount) {
    tone = 'uncertain';
    confidence = Math.max(20, 50 - uncertainCount * 10);
  } else if (confidentCount > 0) {
    tone = 'confident';
    confidence = Math.min(90, 50 + confidentCount * 10);
  }
  
  const clarity = Math.max(0, 100 - uncertainCount * 15);
  
  const suggestions: string[] = [];
  if (tone === 'uncertain') {
    suggestions.push('💡 AI 인사이트: 불확실한 표현을 제거하고 명확한 정보를 제공하세요.');
  }
  
  const hasNumbers = /\d/.test(text);
  if (!hasNumbers && text.length > 50) {
    suggestions.push('💡 AI 인사이트: 구체적인 수치나 데이터를 추가하면 신뢰성이 높아집니다.');
  }
  
  const context_issues: string[] = [];
  if (text.length < 20) {
    context_issues.push('문장이 너무 짧습니다.');
  }
  
  return { confidence, tone, clarity, suggestions, context_issues };
}
