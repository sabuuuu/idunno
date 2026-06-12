import { jikanFetch } from "./client";
import type { JikanAnime, JikanAnimeResponse } from "~/types/jikan";

export async function fetchAnimeById(malId: number): Promise<JikanAnime> {
  const response = await jikanFetch<JikanAnimeResponse>(`/anime/${malId}`);
  return response.data;
}
