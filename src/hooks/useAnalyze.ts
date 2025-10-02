import { useMutation } from '@tanstack/react-query';
import { postAnalyze } from '@/services/analyze.service';
import type { AnalysisResult } from '@/types';

export function useAnalyze() {
  return useMutation<AnalysisResult, Error, { text: string }>({
    mutationFn: ({ text }) => postAnalyze(text),
  });
}
