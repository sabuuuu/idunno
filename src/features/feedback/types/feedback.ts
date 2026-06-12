import { z } from "zod";

export const FeedbackInputSchema = z.object({
  sessionId: z.string().uuid(),
  value: z.union([z.literal(1), z.literal(-1)]),
});

export type FeedbackInput = z.infer<typeof FeedbackInputSchema>;
