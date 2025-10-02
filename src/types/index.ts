export interface Hit {
  term: string;
  cat: 'hedge' | 'vague' | 'softener' | 'apology' | 'filler';
  start: number;
  end: number;
  sentenceIdx: number;
}

export interface ScoreResponse {
  score: number;
  hits: Hit[];
  breakdown: {
    catPenalty: number;
    patternPenalty: number;
    densityPenalty: number;
    bonus: number;
  };
}

export interface Highlight {
  start: number;
  end: number;
  category: string;
  reason: string;
}

export interface RewriteSuggestion {
  original: string;
  improved: string;
  reason: string;
}

export interface AnalysisResult {
  original_text: string;
  ambiguity_score: number;
  highlights: Highlight[];
  categories: string[];
  suggestions: string[];
  rewriteSuggestions?: RewriteSuggestion[];
}

export interface AnalyzeRequest {
  text: string;
}