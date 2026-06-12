export interface JikanAnime {
  mal_id: number;
  title: string;
  title_english: string | null;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
  };
  synopsis: string | null;
  year: number | null;
  genres: Array<{ name: string }>;
  score: number | null;
}

export interface JikanAnimeResponse {
  data: JikanAnime;
}
