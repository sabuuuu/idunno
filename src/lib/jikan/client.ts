const JIKAN_BASE_URL = "https://api.jikan.moe/v4";

export async function jikanFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${JIKAN_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Jikan request failed: ${response.status} ${path}`);
  }

  return response.json() as Promise<T>;
}
