# Idonnu — App Context

> Single source of truth for pages, features, data flow, and domain terminology.

---

## What the app does

Idonnu is a movie/TV/anime recommendation app. The user answers 5 questions about their vibe and preferences, an LLM picks exactly one title, and the result is saved and served as a shareable URL. Users can save titles to their watchlist, leave thumbs up/down feedback, and log in to sync their folders (faves, watchlist, and history) across devices.

---

## Pages

### `/` — Root redirect

- No UI rendered.
- `beforeLoad` immediately redirects to `/ask`.

---

### `/ask` — Question flow

**Route file:** `src/routes/ask.tsx`

**Purpose:** Walk the user through 5 questions, collect answers, submit to the LLM, navigate to the result.

**Data loading:**
- `loader` calls `getQuestions()` server fn — fetches all active questions from DB, ordered by `order` column, server-side before render.

**User flow:**
1. Question 1 renders. User picks a single option (Movie, TV Series, Anime, etc.).
2. User clicks **Next** → Question 2 renders. Progress dots update.
3. User picks options (selecting up to 3), clicks **Next** → Question 3 renders.
4. Questions 3, 4, and 5 follow similar choices (time, era/language, things to avoid).
5. User clicks **Submit** on the 5th question.
6. `FlowController` fires `onComplete(answers)` → `useRecommend` mutation runs.
7. While the LLM call is in-flight, the `LoadingScreen` replaces the card.
8. On success → `navigate` to `/result/$sessionId`.
9. On error → `toast.error` displayed bottom-right.

**State machine (`useQuestionFlow`):**
```
q1 → q2 → q3 → q4 → q5 → submitting
```
- Answers are stored as `{ [questionId]: selectedOption[] }`.
- `selectAnswer` records the answer without advancing. The first question (content type) is single-select, while subsequent questions allow selecting up to 3 options.
- `goToNext` advances the index and transitions state; on the last question it moves to `submitting`.
- When transitioning to `submitting`, `FlowController` formats the answers map into `{ [questionId]: string }` by joining option choices with `", "`.

**Components:**
- `FlowController` — orchestrates state machine + renders current card. Shows `LoadingScreen` when `isPending`.
- `QuestionCard` — custom retro card with option buttons and a Next/Submit/Back `Button`.
- `ProgressDots` — pill-style step indicators (filled = answered, current = filled, future = dimmed).

---

### `/result/$sessionId` — Result page

**Route file:** `src/routes/result/$sessionId.tsx`

**Purpose:** Display the recommended title with full metadata. Shareable URL — fully server-rendered.

**Data loading:**
- `loader` calls `getResult(sessionId)` server fn.
- `getResult` queries the `picks` table by UUID, then:
  - If `type === "anime"` → fetches metadata from **Jikan API** (MyAnimeList) by `mal_id`.
  - If `type === "movie" | "tv"` → fetches metadata from **OMDB API** by `imdbID` if available, falling back to title search.
- Returns a `MediaResult` object: `{ title, year, poster, plot, genre, rating, type, rationale }`.

**UI:**
- `ResultCard` — custom retro card with:
  - Poster image (left on desktop, top on mobile) with scanning filter.
  - Type badge (`MOVIE` / `TV SERIES` / `ANIME`), year badge, star rating badge.
  - Title heading.
  - Genre tags.
  - Rationale blockquote (the LLM's 2-sentence explanation).
  - Plot paragraph.
  - `FeedbackButtons` at the bottom.
  - `+ WATCHLIST` button to save the recommendation to the user's watchlist (requires logging in).
  - `NEW PICK` button to start over back to `/ask`.

**Error states:**
- `errorComponent` (`ResultErrorBoundary`) — shows the error window + "Try again" / "Start over" buttons. If the error message is `NOT_FOUND`, delegates to the not-found component.
- `notFoundComponent` (`ResultNotFound`) — shown when `sessionId` doesn't match any row. "Start over" link.

---

## Features

### `question-flow` (`src/features/question-flow/`)

| File | Responsibility |
|---|---|
| `server/questions.ts` | `getQuestions` server fn — queries `questions` table (active, ordered) |
| `hooks/use-question-flow.ts` | State machine hook — step, currentIndex, answers, selectAnswer, goToNext, reset |
| `components/flow-controller.tsx` | Drives the flow — renders current card or loader, fires `onComplete` |
| `components/question-card.tsx` | Single question card with option buttons and Next/Back/Submit button |
| `components/progress-dots.tsx` | Visual step indicator |
| `types/question-flow.ts` | `FlowStep` type |

---

### `recommendation` (`src/features/recommendation/`)

| File | Responsibility |
|---|---|
| `server/recommend.ts` | `recommend` server fn — validates input → LLM → OMDB/Jikan → DB insert → returns `sessionId` |
| `server/result.ts` | `getResult` server fn — DB lookup → OMDB/Jikan fetch → returns `MediaResult` |
| `hooks/use-recommend.ts` | TanStack Query mutation wrapping `recommend` server fn |
| `components/result-card.tsx` | Full result display card with poster, metadata badges, rationale, plot, and list controls |
| `types/recommendation.ts` | `RecommendInputSchema`, `RecommendResult`, `MediaResult` |

---

### `feedback` (`src/features/feedback/`)

| File | Responsibility |
|---|---|
| `server/feedback.ts` | `submitFeedback` & `toggleWatchlist` server fns — updates feedback/watchlist values in `picks` table |
| `hooks/use-feedback.ts` | TanStack Query mutation wrapping `submitFeedback` |
| `components/feedback-buttons.tsx` | Thumbs up/down buttons with toast confirmation. |
| `types/feedback.ts` | `FeedbackInputSchema` (`sessionId` + `value: 1 | -1`) |

---

### `desktop-apps` (`src/features/desktop-apps/`)

| File | Responsibility |
|---|---|
| `FolderWindow.tsx` | Displays items in a folder (History, Faves, Watchlist). Requires login for Faves/Watchlist. |
| `LoginWindow.tsx` | Renders a Win98-style login and registration window. |
| `LogoutWindow.tsx` | Renders a Logout confirmation interface. |

---

## Shared Libraries

### `src/lib/db/`
- `index.ts` — Drizzle singleton client (HMR-safe, uses `DATABASE_URL`).
- `schema.ts` — Single source of truth for the DB schema.
- `queries/similar-picks.ts` — Fetches up to 3 past picks with positive feedback whose answers overlap with the current request (used for few-shot prompt injection).

### `src/lib/llm/`
- `client.ts` — OpenAI SDK init (`OPENAI_API_KEY`).
- `prompt.ts` — `buildPrompt(answers, examples)` — constructs the system + user messages with stable labels.
- `recommend.ts` — Calls GPT model, enforces JSON response format, validates output.

### `src/lib/omdb/`
- `client.ts` — Fetch wrapper with `OMDB_API_KEY` query param.
- `queries.ts` — `searchOmdbTitle(title, type)` and `fetchOmdbById(imdbId)` wrappers.

### `src/lib/jikan/`
- `client.ts` — Fetch wrapper for the Jikan v4 API (no auth required).
- `queries.ts` — `fetchAnimeById(malId)` → `JikanAnime`.

---

## Data Flow — end-to-end

```
Browser                         Server                          External
──────                          ──────                          ────────
/ ──beforeLoad──────────────→ redirect to /ask

/ask
  loader ───────────────────→ getQuestions()
                               SELECT questions WHERE active=true
  ←─────────────────────────── Question[]

  [user answers all 5]

  useRecommend.mutate(answers)
              ─────────────→ recommend(answers)
                               Zod validate
                               fetchSimilarPositivePicks()  ← DB
                               buildPrompt(answers, examples)
                               openai.chat.completions ──────────→ GPT-4o
                                                       ←────────── JSON
                               LlmResponseSchema.parse()
                               if anime: fetchAnimeById() ────────→ Jikan
                               else:     searchOmdbTitle() ───────→ OMDB
                               INSERT INTO picks ... RETURNING id
  ←───────────────────────── { sessionId, title, type, ... }

  navigate(/result/$sessionId)

/result/$sessionId
  loader ───────────────────→ getResult(sessionId)
                               SELECT picks WHERE id = sessionId
                               if anime: fetchAnimeById() ────────→ Jikan
                               else:     searchOmdbTitle() ───────→ OMDB (by imdb_id or title)
  ←─────────────────────────── MediaResult

  [user clicks 👍 or 👎]

  useFeedback.mutate({ sessionId, value })
              ─────────────→ submitFeedback({ sessionId, value })
                               UPDATE picks SET feedback = value
  ←───────────────────────── { ok: true }

  [user clicks + WATCHLIST]

  toggleWatchlist({ sessionId, inWatchlist })
              ─────────────→ toggleWatchlist({ sessionId, inWatchlist })
                               UPDATE picks SET in_watchlist = true
  ←───────────────────────── { ok: true }
```

---

## Database Schema

### `users`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK, random default |
| `username` | `text` | Unique username |
| `password_hash` | `text` | SHA-256 password hash |
| `created_at` | `timestamp` | Auto-set on insert |

### `questions`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK, random default |
| `order` | `integer` | Display order |
| `text` | `text` | Question text |
| `options` | `jsonb` | `string[]` of selectable options |
| `active` | `boolean` | Only active questions are served |

### `picks`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK — also the `sessionId` in URLs |
| `user_id` | `uuid` | FK references `users.id` (nullable) |
| `answers` | `jsonb` | `{ [questionId]: selectedOption }` where options are comma-separated strings |
| `result_imdb_id` | `text` | IMDB ID for movies/TV (nullable) |
| `result_mal_id` | `integer` | MyAnimeList ID for anime (nullable) |
| `result_title` | `text` | Title from LLM |
| `result_type` | `text` | `"movie"` \| `"tv"` \| `"anime"` |
| `rationale` | `text` | LLM's explanation |
| `feedback` | `smallint` | `1` = thumbs up, `-1` = thumbs down, `null` = no feedback |
| `in_watchlist` | `boolean` | `true` = saved to watchlist, `false` = default |
| `created_at` | `timestamp` | Auto-set on insert |

---

## Environment Variables

| Variable | Used by | Notes |
|---|---|---|
| `DATABASE_URL` | Drizzle runtime client | Transaction pooler, port 6543 |
| `DIRECT_URL` | drizzle-kit migrations | Direct connection, port 5432 |
| `OPENAI_API_KEY` | `src/lib/llm/client.ts` | GPT Model key |
| `OMDB_API_KEY` | `src/lib/omdb/client.ts` | Free tier at omdbapi.com |
| `TMDB_BASE_URL` | — | `https://api.themoviedb.org/3` (reserved) |
| `VITE_APP_URL` | Client bundle | `http://localhost:3000` in dev |

Jikan (MyAnimeList) requires no API key.

---

## Domain Vocabulary

| Term | Definition |
|---|---|
| **pick** | A single recommendation session — one row in `picks`, identified by a UUID that becomes the shareable URL. |
| **session** / **sessionId** | The UUID of a `pick`. Used in `/result/$sessionId`. |
| **question** | A DB-driven prompt with a fixed set of options. Loaded fresh per request so they can be changed without a deploy. |
| **answer** | A user's selected options for one question, joined as a comma-separated string if multiple options are chosen. |
| **rationale** | The LLM's 2-sentence explanation for why it picked this title given the user's answers. |
| **few-shot examples** | Past picks with positive feedback (`feedback = 1`) whose answers overlap with the current request, injected into the LLM prompt at inference time. |
| **flow** | The state machine that steps the user through questions: `q1 → q2 → q3 → q4 → q5 → submitting`. |
| **Watchlist** | A collection of user-saved recommendations. |
| **Faves** | User-saved recommendations with positive feedback. |
| **History** | Chronological history of user's recommendations (synced with DB if logged in, local-only if not). |

