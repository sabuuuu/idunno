import { createServerFn } from "@tanstack/react-start";
import { db } from "~/lib/db";
import { picks } from "~/lib/db/schema";
import { getRecommendation } from "~/lib/llm/recommend";
import { searchOmdbTitle } from "~/lib/omdb/queries";
import { fetchAnimeById } from "~/lib/jikan/queries";
import {
  RecommendInputSchema,
  type RecommendResult,
} from "~/features/recommendation/types/recommendation";

export const recommend = createServerFn({ method: "POST" })
  .validator((data: unknown) => RecommendInputSchema.parse(data))
  .handler(async ({ data }): Promise<RecommendResult> => {
    let llmResult;
    try {
      llmResult = await getRecommendation(data.answers);
    } catch {
      throw new Error("Could not generate a recommendation. Please try again.");
    }

    let imdbId: string | undefined;
    let malId: number | undefined;

    if (llmResult.type === "anime") {
      malId = llmResult.mal_id;
      await fetchAnimeById(malId).catch(() => undefined);
    } else {
      await searchOmdbTitle(llmResult.title, llmResult.type)
        .then((r) => { imdbId = r.imdbID; })
        .catch(() => undefined);
    }

    const [pick] = await db
      .insert(picks)
      .values({
        answers: data.answers,
        resultImdbId: imdbId ?? null,
        resultMalId: malId ?? null,
        resultTitle: llmResult.title,
        resultType: llmResult.type,
        rationale: llmResult.rationale,
      })
      .returning({ id: picks.id });

    if (!pick) {
      throw new Error("Failed to save recommendation. Please try again.");
    }

    return {
      sessionId: pick.id,
      imdbId,
      malId,
      title: llmResult.title,
      type: llmResult.type,
      rationale: llmResult.rationale,
    };
  });
