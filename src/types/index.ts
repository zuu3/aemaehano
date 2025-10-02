export type Hit = {
  term: string;
  cat: 'hedge' | 'vague' | 'softener' | 'apology' | 'filler';
  start: number;
  end: number;
  sentenceIdx: number;
};

export type ScoreBreakdown = {
  catPenalty: number;
  patternPenalty: number;
  densityPenalty: number;
  bonus: number;
};

export type ScoreResponse = {
  score: number;
  hits: Hit[];
  breakdown: ScoreBreakdown;
};
