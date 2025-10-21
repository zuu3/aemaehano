import { customAxios } from '@/lib/customAxios';
import type { AnalysisResult, AnalysisMode } from '@/types';

export async function postAnalyze(text: string, mode?: AnalysisMode): Promise<AnalysisResult> {
  const { data } = await customAxios.post<AnalysisResult>('/api/analyze', {
    text,
    mode: mode || 'business'
  });
  return data;
}
