import { customAxios } from '@/lib/customAxios';
import type { AnalysisResult } from '@/types';

export async function postAnalyze(text: string): Promise<AnalysisResult> {
  const { data } = await customAxios.post<AnalysisResult>('/api/analyze', { text });
  return data;
}
