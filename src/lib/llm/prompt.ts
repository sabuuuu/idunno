import type { SimilarPick } from "~/lib/db/queries/similar-picks";

function buildExamplesBlock(examples: SimilarPick[]): string {
  if (examples.length === 0) return "";

  const lines = examples
    .map((ex) => {
      const answerLines = Object.values(ex.answers)
        .map((v, i) => `  Q${i + 1}: ${v}`)
        .join("\n");
      const typeLabel = ex.resultType === "anime" ? "anime" : ex.resultType;
      return `Answers:\n${answerLines}\nRecommendation: ${ex.resultTitle} (${typeLabel})\nRationale: ${ex.rationale}`;
    })
    .join("\n\n");

  return `\n\nHere are examples of past recommendations that users liked:\n\n${lines}`;
}

export function buildPrompt(
  answers: Record<string, string>,
  examples: SimilarPick[] = [],
): { system: string; user: string } {
  const answerLines = Object.values(answers)
    .map((answer, i) => `Q${i + 1}: ${answer}`)
    .join("\n");

  const examplesBlock = buildExamplesBlock(examples);

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
- Output nothing outside the JSON object. Not a single extra character.${examplesBlock}`;

  const user = `Here are my preferences:\n${answerLines}\n\nRespond with the JSON object only.`;

  return { system, user };
}
