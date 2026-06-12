import { z } from "zod";

export const RecommendInputSchema = z.object({
  answers: z.record(z.string(), z.string()),
});

export type RecommendInput = z.infer<typeof RecommendInputSchema>;

export interface RecommendResult {
  sessionId: string;
  imdbId?: string;
  malId?: number;
  title: string;
  type: "movie" | "tv" | "anime";
  rationale: string;
}

export interface MediaResult {
  title: string;
  year: string;
  poster: string;
  plot: string;
  genre: string;
  rating: string;
  type: "movie" | "tv" | "anime";
  rationale: string;
}
