CREATE TABLE "picks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"answers" jsonb NOT NULL,
	"result_tmdb_id" integer,
	"result_title" text,
	"result_type" text,
	"rationale" text,
	"feedback" smallint,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order" integer NOT NULL,
	"text" text NOT NULL,
	"options" jsonb NOT NULL,
	"active" boolean DEFAULT true NOT NULL
);
