import { openai } from "./client";
import { buildPrompt } from "./prompt";
import { LlmResponseSchema, type LlmResponse } from "~/types/llm";

const MODEL = "gpt-4o";

export async function getRecommendation(
  answers: Record<string, string>,
): Promise<LlmResponse> {
  const { system, user } = buildPrompt(answers);

  const response = await openai.chat.completions.create({
    model: MODEL,
    max_tokens: 512,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  const raw = response.choices[0]?.message?.content;

  if (!raw) {
    throw new Error("LLM returned an empty response");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw.trim());
  } catch {
    throw new Error(`LLM response is not valid JSON: ${raw}`);
  }

  const result = LlmResponseSchema.safeParse(parsed);

  if (!result.success) {
    throw new Error(`LLM response failed schema validation: ${result.error.message}`);
  }

  return result.data;
}
