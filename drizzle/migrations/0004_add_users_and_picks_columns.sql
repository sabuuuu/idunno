-- Create users table (may already exist, safe with IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL UNIQUE,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

--> statement-breakpoint
-- Add user_id FK to picks
ALTER TABLE "picks" ADD COLUMN IF NOT EXISTS "user_id" uuid REFERENCES "users"("id");

--> statement-breakpoint
-- Add in_watchlist to picks
ALTER TABLE "picks" ADD COLUMN IF NOT EXISTS "in_watchlist" boolean NOT NULL DEFAULT false;
