// 분석 모드 타입
export type AnalysisMode = 'business' | 'blog' | 'casual' | 'academic' | 'creative';

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
  improved_text?: string;
  rewriteSuggestions?: RewriteSuggestion[];
  analysis_mode?: AnalysisMode;
}

export interface AnalyzeRequest {
  text: string;
  mode?: AnalysisMode;
}

export interface Document {
  id: string;
  user_id: string;
  title: string;
  original_text: string;
  ambiguity_score: number;
  highlights: Highlight[];
  categories: string[];
  suggestions: string[];
  analysis_mode?: AnalysisMode; // 추가
  created_at: string;
  updated_at: string;
}

export interface CreateDocumentRequest {
  title: string;
  original_text: string;
  ambiguity_score: number;
  highlights: Highlight[];
  categories: string[];
  analysis_mode?: AnalysisMode; // 추가
  suggestions: string[];
}