/**
 * Seed the question set — clears existing rows and inserts the current set.
 * Run with: pnpm db:seed
 */
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { questions } from "../src/lib/db/schema.js";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

const defaultQuestions = [
  {
    order: 1,
    text: "What do you want to watch?",
    options: [
      "A movie (live-action)",
      "A TV series (live-action)",
      "Anime",
      "Animation (western / Pixar / Studio Ghibli)",
      "A documentary",
    ],
  },
  {
    order: 2,
    text: "What's the vibe tonight?",
    options: [
      "I want to laugh",
      "I want to feel something deep",
      "I want tension — thriller or suspense",
      "I want big action or spectacle",
      "I want something cosy and calm",
    ],
  },
  {
    order: 3,
    text: "How much time do you have?",
    options: [
      "Under 90 minutes",
      "A proper 2-hour film",
      "A few episodes (2–4)",
      "I'm ready to binge",
    ],
  },
  {
    order: 4,
    text: "Any preference on era or language?",
    options: [
      "Modern (2010s–now)",
      "A classic (pre-2000s)",
      "Foreign language is fine",
      "English only please",
      "No preference",
    ],
  },
  {
    order: 5,
    text: "What do you want to avoid?",
    options: [
      "Anything too dark or violent",
      "Slow burns — I need pace",
      "Horror or jump scares",
      "Heavy romance",
      "Nothing — I'm open to everything",
    ],
  },
];

async function seed() {
  console.log("Clearing existing questions…");
  await db.delete(questions);
  console.log("Inserting new questions…");
  await db.insert(questions).values(defaultQuestions);
  console.log(`Done — ${defaultQuestions.length} questions seeded.`);
  await client.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
