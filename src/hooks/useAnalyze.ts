import { useMutation } from '@tanstack/react-query';
import { postAnalyze } from '@/services/analyze.service';
import type { AnalysisResult, AnalyzeRequest } from '@/types';

export function useAnalyze() {
  return useMutation<AnalysisResult, Error, AnalyzeRequest>({
    mutationFn: ({ text, mode }) => postAnalyze(text, mode),
  });
}
