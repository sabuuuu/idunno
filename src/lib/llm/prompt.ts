export function buildPrompt(answers: Record<string, string>): {
  system: string;
  user: string;
} {
  const answerLines = Object.values(answers)
    .map((answer, i) => `Q${i + 1}: ${answer}`)
    .join("\n");

  const system = `You are a film oracle. Your sole output is a single JSON object — no prose, no markdown, no alternatives, no hedging.

The JSON must match this exact shape:
{
  "tmdb_id": <integer, the TMDB id of the title>,
  "title": <string, the exact English title>,
  "type": <"movie" | "tv" | "anime">,
  "rationale": <string, two sentences max explaining why this title fits>
}

Rules:
- Recommend exactly one title. Never recommend more.
- Prefer titles with strong TMDB coverage (wide releases, well-documented series).
- The rationale must reference at least one detail from the user's answers.
- Output nothing outside the JSON object. Not a single extra character.`;

  const user = `Here are my preferences:\n${answerLines}\n\nRespond with the JSON object only.`;

  return { system, user };
}
