const JIKAN_BASE_URL = "https://api.jikan.moe/v4";
const RETRY_AFTER_MS = 1000;
const MAX_RETRIES = 3;

export async function jikanFetch<T>(path: string): Promise<T> {
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    const response = await fetch(`${JIKAN_BASE_URL}${path}`);

    if (response.status === 429) {
      attempt++;
      if (attempt >= MAX_RETRIES) {
        throw new Error("Jikan rate limit exceeded — try again in a moment");
      }
      await new Promise((resolve) => setTimeout(resolve, RETRY_AFTER_MS * attempt));
      continue;
    }

    if (!response.ok) {
      throw new Error(`Jikan request failed: ${response.status} ${path}`);
    }

    return response.json() as Promise<T>;
  }

  throw new Error("Jikan request failed after retries");
}
