import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "~/lib/db";
import { picks } from "~/lib/db/schema";
import { FeedbackInputSchema } from "~/features/feedback/types/feedback";
import { getSessionUserServerFn } from "~/server/auth";

export const submitFeedback = createServerFn({ method: "POST" })
  .validator((data: unknown) => FeedbackInputSchema.parse(data))
  .handler(async ({ data }) => {
    const user = await getSessionUserServerFn();
    const result = await db
      .update(picks)
      .set({ 
        feedback: data.value,
        ...(user ? { userId: user.id } : {})
      })
      .where(eq(picks.id, data.sessionId))
      .returning({ id: picks.id });

    if (result.length === 0) {
      throw new Error("Could not save feedback — session not found.");
    }

    return { ok: true };
  });

export const toggleWatchlist = createServerFn({ method: "POST" })
  .validator((data: { sessionId: string; inWatchlist: boolean }) => data)
  .handler(async ({ data }) => {
    const user = await getSessionUserServerFn();
    const result = await db
      .update(picks)
      .set({ 
        inWatchlist: data.inWatchlist,
        ...(user ? { userId: user.id } : {})
      })
      .where(eq(picks.id, data.sessionId))
      .returning({ id: picks.id });

    if (result.length === 0) {
      throw new Error("Could not update watchlist — session not found.");
    }

    return { ok: true };
  });
