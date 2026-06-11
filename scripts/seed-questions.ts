/**
 * Seed the default question set.
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
    text: "What mood are you in tonight?",
    options: [
      "I want to laugh",
      "I want to feel something",
      "I want to be on the edge of my seat",
      "I want to switch my brain off",
    ],
  },
  {
    order: 2,
    text: "How much time do you have?",
    options: [
      "Under 90 minutes",
      "A full movie (90–120 min)",
      "A couple of episodes",
      "I'll binge all night",
    ],
  },
  {
    order: 3,
    text: "What do you want to avoid?",
    options: [
      "Anything too heavy or dark",
      "Slow burns",
      "Jump scares or gore",
      "I'm open to anything",
    ],
  },
];

async function seed() {
  console.log("Seeding questions…");
  await db.insert(questions).values(defaultQuestions).onConflictDoNothing();
  console.log("Done.");
  await client.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
