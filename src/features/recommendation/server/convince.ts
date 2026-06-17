import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/lib/db";
import { picks } from "~/lib/db/schema";
import { openai } from "~/lib/llm/client";

export const convinceMe = createServerFn({ method: "POST" })
  .validator((data: { sessionId: string }) => {
    return z.object({ sessionId: z.string().uuid() }).parse(data);
  })
  .handler(async ({ data: { sessionId } }) => {
    const [pick] = await db
      .select()
      .from(picks)
      .where(eq(picks.id, sessionId))
      .limit(1);

    if (!pick) {
      throw new Error("Could not find recommendation session.");
    }

    if (pick.convincePitch) {
      return { pitch: pick.convincePitch };
    }

    // Prepare prompt
    const contentLabel = pick.resultType ? pick.resultType.toUpperCase() : "TITLE";
    const userAnswers = Object.entries(pick.answers || {})
      .map(([qId, val]) => `- Preference: ${val}`)
      .join("\n");

    const prompt = `You are a film oracle and a highly enthusiastic hype-person. The user was recommended the ${contentLabel} "${pick.resultTitle}" based on their answers.

Original recommendation rationale:
"${pick.rationale}"

User preferences:
${userAnswers}

Write a highly energetic, persuasive, 3-sentence sales pitch to convince the user to watch this choice immediately. Reference at least one of their preferences in the pitch. Avoid generic clichés. Return ONLY the 3 sentences of persuasion. Do not include markdown formatting, headers, or quotes around the text.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 256,
      messages: [
        { role: "system", content: "You are a punchy film marketer. Write a highly persuasive 3-sentence sales pitch. Do not wrap the output in quotes." },
        { role: "user", content: prompt },
      ],
    });

    const pitch = response.choices[0]?.message?.content?.trim() || "";

    if (!pitch) {
      throw new Error("LLM failed to generate a sales pitch.");
    }

    // Save back to DB
    await db
      .update(picks)
      .set({ convincePitch: pitch })
      .where(eq(picks.id, sessionId));

    return { pitch };
  });
