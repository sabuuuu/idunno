import { useMutation } from "@tanstack/react-query";
import { submitFeedback } from "~/features/feedback/server/feedback";
import type { FeedbackInput } from "~/features/feedback/types/feedback";

export function useFeedback() {
  return useMutation({
    mutationFn: (input: FeedbackInput) =>
      submitFeedback({ data: input }),
  });
}
