import { omdbFetch } from "./client";
import type { OmdbTitle } from "~/types/omdb";

/** Direct lookup by imdbID — most reliable, guaranteed correct poster. */
export async function fetchOmdbById(imdbId: string): Promise<OmdbTitle> {
  return omdbFetch<OmdbTitle>({ i: imdbId, plot: "short" });
}

/** Title search fallback — used at recommendation time to resolve the imdbID. */
export async function searchOmdbTitle(
  title: string,
  type: "movie" | "tv",
): Promise<OmdbTitle> {
  const omdbType = type === "tv" ? "series" : "movie";
  return omdbFetch<OmdbTitle>({ t: title, type: omdbType, plot: "short" });
}
