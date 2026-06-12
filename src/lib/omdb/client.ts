const BASE_URL = process.env.OMDB_BASE_URL!;
const API_KEY = process.env.OMDB_API_KEY!;

export async function omdbFetch<T>(params: Record<string, string>): Promise<T> {
  const query = new URLSearchParams({ ...params, apikey: API_KEY });
  const response = await fetch(`${BASE_URL}?${query}`);

  if (!response.ok) {
    throw new Error(`OMDB request failed: ${response.status}`);
  }

  const data = (await response.json()) as T & { Response: string; Error?: string };

  if (data.Response === "False") {
    throw new Error(`OMDB error: ${data.Error ?? "Unknown error"}`);
  }

  return data;
}
