# NoSearch — build plan

## overview

6 phases from zero to a working, deployed app with a feedback loop. Each phase ends with something runnable — no phase leaves the app in a broken state.

---

## phase 0 — configuration

**goal**: repo boots, db is reachable, env is wired, nothing is hardcoded.

### 0.1 — init repo

```bash
pnpm create tanstack-start@latest nosearch
```

When prompted, choose TypeScript. Then install core deps:

```bash
pnpm add drizzle-orm @supabase/supabase-js postgres
pnpm add -D drizzle-kit dotenv-cli
```

### 0.2 — supabase project

- create project at supabase.com
- copy `DATABASE_URL` (transaction pooler, port 6543) and `DIRECT_URL` (port 5432, for migrations)
- note: drizzle-kit needs `DIRECT_URL` for `drizzle-kit push/migrate`; the app uses `DATABASE_URL` at runtime

### 0.3 — env setup

`.env.local`:

```
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
DIRECT_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
ANTHROPIC_API_KEY=sk-ant-...
TMDB_API_KEY=...
TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_APP_URL=http://localhost:3000
```

`.env.example` — same keys, empty values, committed to git.

Note: `VITE_` prefix exposes a var to the client bundle. All other vars (db, api keys) are server-only and never prefixed.

### 0.4 — app config

`app.config.ts`:

```ts
import { defineConfig } from "@tanstack/start/config";

export default defineConfig({
  server: {
    preset: "node-server", // swap to "vercel" for deploy
  },
});
```

### 0.5 — drizzle config

`drizzle.config.ts`:

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DIRECT_URL!,
  },
});
```

### 0.6 — initial schema

`src/lib/db/schema.ts`:

```ts
import { pgTable, uuid, text, jsonb, smallint, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const questions = pgTable("questions", {
  id:      uuid("id").primaryKey().defaultRandom(),
  order:   integer("order").notNull(),
  text:    text("text").notNull(),
  options: jsonb("options").$type<string[]>().notNull(),
  active:  boolean("active").notNull().default(true),
});

export const picks = pgTable("picks", {
  id:           uuid("id").primaryKey().defaultRandom(),
  answers:      jsonb("answers").$type<Record<string, string>>().notNull(),
  resultTmdbId: integer("result_tmdb_id"),
  resultTitle:  text("result_title"),
  resultType:   text("result_type"),   // "movie" | "tv" | "anime"
  rationale:    text("rationale"),
  feedback:     smallint("feedback"),  // -1 | null | 1
  createdAt:    timestamp("created_at").defaultNow().notNull(),
});
```

run first migration:

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

### 0.7 — drizzle client singleton

`src/lib/db/index.ts`:

```ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });
```

### 0.8 — verify

Add a health check server function `src/server/health.ts`:

```ts
import { createServerFn } from "@tanstack/start";
import { db } from "~/lib/db";
import { questions } from "~/lib/db/schema";

export const healthCheck = createServerFn({ method: "GET" }).handler(async () => {
  await db.select().from(questions).limit(1);
  return { ok: true };
});
```

Call it from `__root.tsx` loader. If it resolves without throwing, phase 0 is done.

---

## phase 1 — question engine

**goal**: 3 questions load from db, user can answer all 3, state is managed cleanly.

- seed default questions via `scripts/seed-questions.ts`
- write `src/server/questions.ts` — `createServerFn` that fetches active questions ordered by `order`
- call it in the `ask.tsx` route's `loader` so questions arrive server-side, no client fetch needed
- build `use-question-flow.ts` — state machine: `idle → q1 → q2 → q3 → submitting`
- build `question-card.tsx` + `progress-dots.tsx`
- build `flow-controller.tsx` — drives the transition, receives questions as props, no logic leaked into render
- `ask.tsx` reads loader data via `useLoaderData`, passes questions down to `flow-controller`
- on Q3 submit, log answers to console — no API call yet

**done when**: you can answer all 3 questions and see the answers logged.

---

## phase 2 — LLM integration

**goal**: 3 answers → one real recommendation from the model.

- install `@anthropic-ai/sdk`
- write `src/lib/llm/prompt.ts` — `buildPrompt(answers)` returns a tight system + user message pair
- write `src/lib/llm/recommend.ts` — calls the model, parses the JSON response, throws on malformed output
- write `src/server/recommend.ts` — `createServerFn` with method `POST`: validates body with zod, calls `recommend()`, persists to `picks`, returns `{ sessionId, tmdbId, title, type, rationale }`
- build `use-recommend.ts` hook — tanstack query mutation that calls the recommend server fn directly (no HTTP wiring needed)
- wire the submit in `flow-controller.tsx` → calls the mutation → navigates to `/result/$sessionId` via `useNavigate`

**prompt design notes**:
- system: oracle persona, strict JSON-only output, no alternatives, no hedging
- user: one line per answer, explicit format instruction
- include a `zod` parse step on the LLM response — the model *will* drift occasionally

**done when**: submitting answers returns a real title with a rationale.

---

## phase 3 — result page + TMDB

**goal**: result looks like a proper movie card, not a JSON dump.

- get TMDB API key from themoviedb.org (free)
- write `src/lib/tmdb/client.ts` + `queries.ts`
- update `src/server/recommend.ts` to also call TMDB after the LLM step and persist the enriched pick
- write `src/server/result.ts` — `createServerFn` that fetches pick from db by sessionId + TMDB metadata
- `result/$sessionId.tsx` route: call the result server fn in its `loader`, render fully server-side
- build `result-card.tsx` — poster image, title, year, type badge, rationale in 2 sentences
- build `feedback-buttons.tsx` — thumbs up/down, calls the feedback server fn directly

**done when**: you get a shareable `/result/$sessionId` URL with a poster and a one-paragraph rationale.

---

## phase 4 — polish + edge cases

**goal**: app feels deliberate, not like a prototype.

- loading state between Q3 and result — not a spinner, something theatrical (e.g. "consulting the oracle…" with a slow fade); use tanstack router's `<Await>` or pending component for the transition
- error state if LLM returns garbage or TMDB 404s — graceful fallback, not a white screen
- `errorComponent` and `notFoundComponent` on the result route (file-based route options in TanStack Start)
- mobile layout pass — the question flow should feel native on phone
- rate limiting on the recommend server fn — simple upstash ratelimit check at the top of the handler, 5 req/min per IP (read IP from the request context TanStack Start exposes via `getRequestHeader`)
- `VITE_APP_URL` used for og:image meta tags on result pages via `<Meta>` in the route's `head` export

**done when**: you'd hand your phone to someone and feel fine watching them use it.

---

## phase 5 — feedback loop (the ML part)

**goal**: collected signal shapes future recommendations.

- verify feedback data is accumulating in `picks` table
- write a simple analytics query: top picks, % positive feedback, answer patterns that correlate with thumbs up
- add few-shot injection to the prompt: at inference time, query the 3 most similar past picks with positive feedback (by answer overlap) and prepend them as examples → instant improvement without fine-tuning
- optional v2: embed answers with a small model (`text-embedding-3-small`), store vectors in pgvector (supabase supports it), do proper semantic similarity retrieval

**done when**: the prompt includes real past examples and results visibly improve.

---

## phase 6 — deploy

**goal**: live URL, zero manual steps to ship.

- set `server.preset` in `app.config.ts` to `"vercel"` and deploy to Vercel
- set all env vars in Vercel dashboard (no `VITE_` stripping — Vercel respects Vite conventions)
- enable Vercel Analytics
- set up a GitHub Action: `pnpm typecheck && pnpm lint` on every PR
- point a custom domain if desired

**done when**: `git push` → live in 2 minutes.

---

## dependency map

| concern | library | why |
|---|---|---|
| framework | tanstack start | file-based routing, server fns, full-stack React without a separate API layer |
| styling | tailwind css v4 | utility-first, no context switching |
| db ORM | drizzle-orm | type-safe, close to SQL, great with supabase |
| db host | supabase (postgres) | auth + storage available for future phases |
| LLM | anthropic sdk | claude sonnet — better instruction following for strict JSON |
| media data | TMDB API | free, comprehensive, good poster quality |
| data fetching | tanstack query | mutation state for the recommend flow; pairs naturally with tanstack start |
| validation | zod | LLM response parsing, server fn input validation |
| rate limiting | upstash ratelimit | serverless-friendly, redis-backed |
