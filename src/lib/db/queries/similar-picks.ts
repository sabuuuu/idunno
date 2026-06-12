import { and, eq, isNotNull } from "drizzle-orm";
import { db } from "~/lib/db";
import { picks } from "~/lib/db/schema";

export interface SimilarPick {
  answers: Record<string, string>;
  resultTitle: string;
  resultType: string;
  rationale: string;
}

export async function fetchSimilarPositivePicks(
  answers: Record<string, string>,
  limit = 3,
): Promise<SimilarPick[]> {
  const positivePicks = await db
    .select({
      answers: picks.answers,
      resultTitle: picks.resultTitle,
      resultType: picks.resultType,
      rationale: picks.rationale,
    })
    .from(picks)
    .where(
      and(
        eq(picks.feedback, 1),
        isNotNull(picks.resultTitle),
        isNotNull(picks.rationale),
      ),
    );

  const currentValues = new Set(Object.values(answers));

  return positivePicks
    .filter(
      (p): p is SimilarPick =>
        p.resultTitle !== null &&
        p.resultType !== null &&
        p.rationale !== null,
    )
    .map((p) => ({
      pick: p,
      overlap: Object.values(p.answers).filter((v) => currentValues.has(v)).length,
    }))
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map(({ pick }) => pick);
}
