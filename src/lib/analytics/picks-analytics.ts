import { isNotNull } from "drizzle-orm";
import { db } from "~/lib/db";
import { picks } from "~/lib/db/schema";

export interface PicksAnalytics {
  total: number;
  positiveCount: number;
  negativeCount: number;
  positivePct: number;
  topTitles: Array<{ title: string; count: number; positivePct: number }>;
  topAnswerPatterns: Array<{ answer: string; positivePct: number; count: number }>;
}

export async function getPicksAnalytics(): Promise<PicksAnalytics> {
  const allPicks = await db
    .select({
      resultTitle: picks.resultTitle,
      feedback: picks.feedback,
      answers: picks.answers,
    })
    .from(picks)
    .where(isNotNull(picks.resultTitle));

  const total = allPicks.length;
  const positiveCount = allPicks.filter((p) => p.feedback === 1).length;
  const negativeCount = allPicks.filter((p) => p.feedback === -1).length;
  const positivePct = total > 0 ? Math.round((positiveCount / total) * 100) : 0;

  const titleMap = new Map<string, { count: number; positive: number }>();
  for (const p of allPicks) {
    const title = p.resultTitle!;
    const existing = titleMap.get(title) ?? { count: 0, positive: 0 };
    titleMap.set(title, {
      count: existing.count + 1,
      positive: existing.positive + (p.feedback === 1 ? 1 : 0),
    });
  }

  const topTitles = [...titleMap.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
    .map(([title, stats]) => ({
      title,
      count: stats.count,
      positivePct: stats.count > 0 ? Math.round((stats.positive / stats.count) * 100) : 0,
    }));

  const answerMap = new Map<string, { count: number; positive: number }>();
  for (const p of allPicks) {
    for (const value of Object.values(p.answers)) {
      const existing = answerMap.get(value) ?? { count: 0, positive: 0 };
      answerMap.set(value, {
        count: existing.count + 1,
        positive: existing.positive + (p.feedback === 1 ? 1 : 0),
      });
    }
  }

  const topAnswerPatterns = [...answerMap.entries()]
    .filter(([, stats]) => stats.count >= 3)
    .sort((a, b) => b[1].positive / b[1].count - a[1].positive / a[1].count)
    .slice(0, 10)
    .map(([answer, stats]) => ({
      answer,
      count: stats.count,
      positivePct: Math.round((stats.positive / stats.count) * 100),
    }));

  return { total, positiveCount, negativeCount, positivePct, topTitles, topAnswerPatterns };
}
