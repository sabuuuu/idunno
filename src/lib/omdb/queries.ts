import { omdbFetch } from "./client";
import type { OmdbTitle } from "~/types/omdb";

export async function searchOmdbTitle(
  title: string,
  type: "movie" | "tv",
): Promise<OmdbTitle> {
  const omdbType = type === "tv" ? "series" : "movie";
  return omdbFetch<OmdbTitle>({ t: title, type: omdbType, plot: "short" });
}
