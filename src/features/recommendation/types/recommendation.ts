import { z } from "zod";

/** Input schema for the recommend server function. */
export const RecommendInputSchema = z.object({
  answers: z.record(z.string(), z.string()),
});

export type RecommendInput = z.infer<typeof RecommendInputSchema>;

export interface RecommendResult {
  sessionId: string;
  tmdbId: number;
  title: string;
  type: "movie" | "tv" | "anime";
  rationale: string;
}
