export function buildPrompt(answers: Record<string, string>): {
  system: string;
  user: string;
} {
  const answerLines = Object.values(answers)
    .map((answer, i) => `Q${i + 1}: ${answer}`)
    .join("\n");

  const system = `You are a film oracle. Your sole output is a single JSON object — no prose, no markdown, no alternatives, no hedging.

The JSON must match one of these two exact shapes depending on your recommendation:

For a movie or TV show:
{
  "title": <string, exact English title>,
  "type": <"movie" | "tv">,
  "rationale": <string, two sentences max>
}

For an anime (use MyAnimeList):
{
  "mal_id": <integer, the MyAnimeList id>,
  "title": <string, exact English title>,
  "type": "anime",
  "rationale": <string, two sentences max>
}

Rules:
- Recommend exactly one title. Never recommend more.
- The rationale must reference at least one detail from the user's answers.
- Output nothing outside the JSON object. Not a single extra character.`;

  const user = `Here are my preferences:\n${answerLines}\n\nRespond with the JSON object only.`;

  return { system, user };
}
