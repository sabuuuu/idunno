import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/lib/db";
import { picks } from "~/lib/db/schema";
import { fetchOmdbById, searchOmdbTitle } from "~/lib/omdb/queries";
import { fetchAnimeById } from "~/lib/jikan/queries";
import type { MediaResult } from "~/features/recommendation/types/recommendation";

const VALID_TYPES = new Set(["movie", "tv", "anime"]);

export const getResult = createServerFn({ method: "GET" })
  .validator((sessionId: unknown) => {
    return z.string().uuid().parse(sessionId);
  })
  .handler(async ({ data: sessionId }): Promise<MediaResult> => {
    const [pick] = await db
      .select()
      .from(picks)
      .where(eq(picks.id, sessionId))
      .limit(1);

    if (!pick) {
      throw new Error("NOT_FOUND");
    }

    if (!pick.resultType || !VALID_TYPES.has(pick.resultType)) {
      throw new Error("Result has an invalid type and cannot be displayed.");
    }

    const type = pick.resultType as "movie" | "tv" | "anime";

    if (type === "anime") {
      if (!pick.resultMalId) {
        throw new Error("Anime result is missing its MyAnimeList ID.");
      }
      const anime = await fetchAnimeById(pick.resultMalId);
      return {
        title: anime.title_english ?? anime.title,
        year: anime.year ? String(anime.year) : "N/A",
        poster: anime.images.jpg.large_image_url,
        plot: anime.synopsis ?? "No synopsis available.",
        genre: anime.genres.map((g) => g.name).join(", "),
        rating: anime.score ? String(anime.score) : "N/A",
        type: "anime",
        rationale: pick.rationale ?? "",
        convincePitch: pick.convincePitch,
        malId: pick.resultMalId,
        imdbId: null,
      };
    }

    if (!pick.resultTitle) {
      throw new Error("Result is missing a title and cannot be displayed.");
    }

    // Prefer direct imdbID lookup (accurate poster) — fall back to title search
    const omdb = pick.resultImdbId
      ? await fetchOmdbById(pick.resultImdbId)
      : await searchOmdbTitle(pick.resultTitle, type);

    return {
      title: omdb.Title,
      year: omdb.Year,
      poster: omdb.Poster !== "N/A" ? omdb.Poster : "",
      plot: omdb.Plot,
      genre: omdb.Genre,
      rating: omdb.imdbRating,
      type,
      rationale: pick.rationale ?? "",
      convincePitch: pick.convincePitch,
      imdbId: pick.resultImdbId || omdb.imdbID || null,
      malId: null,
    };
  });
