import { useMutation } from '@tanstack/react-query';
import { postAnalyze } from '@/services/analyze.service';
import type { ScoreResponse } from '@/types';

export function useAnalyze() {
  return useMutation<ScoreResponse, Error, { text: string }>({
    mutationFn: ({ text }) => postAnalyze(text),
  });
}
