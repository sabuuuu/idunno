import { z } from "zod";

/** Raw JSON shape the LLM must return. */
export const LlmResponseSchema = z.object({
  tmdb_id: z.number().int().positive(),
  title: z.string().min(1),
  type: z.enum(["movie", "tv", "anime"]),
  rationale: z.string().min(1),
});

export type LlmResponse = z.infer<typeof LlmResponseSchema>;
