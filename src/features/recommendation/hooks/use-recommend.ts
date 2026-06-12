import { useMutation } from "@tanstack/react-query";
import { recommend } from "~/features/recommendation/server/recommend";
import type { RecommendResult } from "~/features/recommendation/types/recommendation";

export function useRecommend() {
  return useMutation<RecommendResult, Error, Record<string, string>>({
    mutationFn: (answers) => recommend({ data: { answers } }),
  });
}
