import { createServerFn } from "@tanstack/react-start";
import { db } from "~/lib/db";
import { picks } from "~/lib/db/schema";
import { getRecommendation } from "~/lib/llm/recommend";
import {
  RecommendInputSchema,
  type RecommendResult,
} from "~/features/recommendation/types/recommendation";

export const recommend = createServerFn({ method: "POST" })
  .validator((data: unknown) => RecommendInputSchema.parse(data))
  .handler(async ({ data }): Promise<RecommendResult> => {
    const llmResult = await getRecommendation(data.answers);

    const [pick] = await db
      .insert(picks)
      .values({
        answers: data.answers,
        resultMalId: llmResult.type === "anime" ? llmResult.mal_id : null,
        resultTitle: llmResult.title,
        resultType: llmResult.type,
        rationale: llmResult.rationale,
      })
      .returning({ id: picks.id });

    if (!pick) {
      throw new Error("Failed to persist recommendation");
    }

    return {
      sessionId: pick.id,
      malId: llmResult.type === "anime" ? llmResult.mal_id : undefined,
      title: llmResult.title,
      type: llmResult.type,
      rationale: llmResult.rationale,
    };
  });
