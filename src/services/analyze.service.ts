import { customAxios } from '@/lib/customAxios';
import type { ScoreResponse } from '@/types';

export async function postAnalyze(text: string): Promise<ScoreResponse> {
  const { data } = await customAxios.post<ScoreResponse>('/api/analyze', { text });
  return data;
}
