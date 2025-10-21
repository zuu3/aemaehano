export interface TextStatistics {
  characterCount: number;
  characterCountNoSpaces: number;
  wordCount: number;
  sentenceCount: number;
  averageSentenceLength: number;
  estimatedReadingTimeMinutes: number;
}

/**
 * 텍스트 통계를 계산합니다
 * @param text - 분석할 텍스트
 * @returns 텍스트 통계 객체
 */
export function calculateTextStats(text: string): TextStatistics {
  if (!text || text.trim().length === 0) {
    return {
      characterCount: 0,
      characterCountNoSpaces: 0,
      wordCount: 0,
      sentenceCount: 0,
      averageSentenceLength: 0,
      estimatedReadingTimeMinutes: 0,
    };
  }

  // 글자 수 (공백 포함)
  const characterCount = text.length;

  // 글자 수 (공백 제외)
  const characterCountNoSpaces = text.replace(/\s/g, '').length;

  // 단어 수 (한국어는 어절 기준, 영어는 공백 기준)
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // 문장 수 (., !, ? 기준)
  const sentences = text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(Boolean);
  const sentenceCount = sentences.length;

  // 평균 문장 길이 (단어 수 기준)
  const averageSentenceLength = sentenceCount > 0
    ? Math.round(wordCount / sentenceCount)
    : 0;

  // 읽기 예상 시간 (분)
  // 한국어 평균 읽기 속도: 분당 약 400-500자
  // 영어 평균 읽기 속도: 분당 약 200-250 단어
  const koreanCharCount = (text.match(/[가-힣]/g) || []).length;
  const isKoreanPrimary = koreanCharCount > characterCountNoSpaces / 2;

  const estimatedReadingTimeMinutes = isKoreanPrimary
    ? Math.ceil(characterCountNoSpaces / 450) // 한국어: 분당 450자
    : Math.ceil(wordCount / 225); // 영어: 분당 225 단어

  return {
    characterCount,
    characterCountNoSpaces,
    wordCount,
    sentenceCount,
    averageSentenceLength,
    estimatedReadingTimeMinutes,
  };
}

/**
 * 읽기 시간을 한국어 문자열로 포맷팅합니다
 */
export function formatReadingTime(minutes: number): string {
  if (minutes === 0) return '1분 미만';
  if (minutes === 1) return '약 1분';
  return `약 ${minutes}분`;
}
