import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "~/lib/db";
import { picks } from "~/lib/db/schema";
import { searchOmdbTitle } from "~/lib/omdb/queries";
import { fetchAnimeById } from "~/lib/jikan/queries";
import type { MediaResult } from "~/features/recommendation/types/recommendation";

export const getResult = createServerFn({ method: "GET" })
  .validator((sessionId: unknown) => {
    if (typeof sessionId !== "string") throw new Error("Invalid sessionId");
    return sessionId;
  })
  .handler(async ({ data: sessionId }): Promise<MediaResult> => {
    const [pick] = await db
      .select()
      .from(picks)
      .where(eq(picks.id, sessionId))
      .limit(1);

    if (!pick) throw new Error("Result not found");

    const type = pick.resultType as "movie" | "tv" | "anime";

    if (type === "anime" && pick.resultMalId) {
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
      };
    }

    if (!pick.resultTitle) throw new Error("Missing title on pick");

    const omdb = await searchOmdbTitle(pick.resultTitle, type as "movie" | "tv");
    return {
      title: omdb.Title,
      year: omdb.Year,
      poster: omdb.Poster,
      plot: omdb.Plot,
      genre: omdb.Genre,
      rating: omdb.imdbRating,
      type,
      rationale: pick.rationale ?? "",
    };
  });
