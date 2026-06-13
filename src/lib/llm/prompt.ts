import type { SimilarPick } from "~/lib/db/queries/similar-picks";

// Question order is stable — map index to a human label for the prompt.
const QUESTION_LABELS = [
  "Content type",
  "Vibe",
  "Time available",
  "Era / language",
  "Avoid",
];

function buildExamplesBlock(examples: SimilarPick[]): string {
  if (examples.length === 0) return "";

  const lines = examples
    .map((ex) => {
      const answerLines = Object.values(ex.answers)
        .map((v, i) => `  ${QUESTION_LABELS[i] ?? `Q${i + 1}`}: ${v}`)
        .join("\n");
      const typeLabel = ex.resultType ?? "unknown";
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
    .map((answer, i) => `${QUESTION_LABELS[i] ?? `Q${i + 1}`}: ${answer}`)
    .join("\n");

  const examplesBlock = buildExamplesBlock(examples);

  const system = `You are a film oracle. Your sole output is a single JSON object — no prose, no markdown, no alternatives, no hedging.

CRITICAL — respect the "Content type" answer exactly:
- "A movie (live-action)"                           → type must be "movie"
- "A TV series (live-action)"                       → type must be "tv"
- "Anime"                                           → type must be "anime", include mal_id
- "Animation (western / Pixar / Studio Ghibli)"     → type must be "movie" or "tv", but recommend an animated title
- "A documentary"                                   → type must be "movie" or "tv", but recommend a documentary

The JSON must match one of these two exact shapes:

For a movie or TV show (including animation and documentary):
{
  "title": <string, exact English title>,
  "type": <"movie" | "tv">,
  "rationale": <string, two sentences max>
}

For anime:
{
  "mal_id": <integer, the MyAnimeList id>,
  "title": <string, exact English title>,
  "type": "anime",
  "rationale": <string, two sentences max>
}

Rules:
- Recommend exactly one title. Never recommend more than one.
- The rationale must reference at least one specific detail from the user's answers.
- Respect every constraint the user gave — vibe, time, era, and avoidance.
- Output nothing outside the JSON object. Not a single extra character.${examplesBlock}`;

  const user = `Here are my preferences:\n${answerLines}\n\nRespond with the JSON object only.`;

  return { system, user };
}
