import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "~/lib/db";
import { picks } from "~/lib/db/schema";
import { FeedbackInputSchema } from "~/features/feedback/types/feedback";

export const submitFeedback = createServerFn({ method: "POST" })
  .validator((data: unknown) => FeedbackInputSchema.parse(data))
  .handler(async ({ data }) => {
    await db
      .update(picks)
      .set({ feedback: data.value })
      .where(eq(picks.id, data.sessionId));

    return { ok: true };
  });
