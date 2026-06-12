import { z } from "zod";

const LlmMovieTvSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["movie", "tv"]),
  rationale: z.string().min(1),
});

const LlmAnimeSchema = z.object({
  mal_id: z.number().int().positive(),
  title: z.string().min(1),
  type: z.literal("anime"),
  rationale: z.string().min(1),
});

export const LlmResponseSchema = z.discriminatedUnion("type", [
  LlmMovieTvSchema,
  LlmAnimeSchema,
]);

export type LlmResponse = z.infer<typeof LlmResponseSchema>;
