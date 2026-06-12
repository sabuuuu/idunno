ALTER TABLE "picks" RENAME COLUMN "result_tmdb_id" TO "result_imdb_id";--> statement-breakpoint
ALTER TABLE "picks" ALTER COLUMN "result_imdb_id" SET DATA TYPE text;
