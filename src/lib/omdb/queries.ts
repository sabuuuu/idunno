import { omdbFetch } from "./client";

export interface OmdbTitle {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Plot: string;
  Genre: string;
  imdbRating: string;
  Type: string;
}

/** Search by title and type ("movie" | "series") — returns the best match. */
export async function searchOmdbTitle(
  title: string,
  type: "movie" | "tv",
): Promise<OmdbTitle> {
  // OMDB uses "series" for TV shows
  const omdbType = type === "tv" ? "series" : "movie";

  return omdbFetch<OmdbTitle>({ t: title, type: omdbType, plot: "short" });
}
