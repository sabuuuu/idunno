import {
  pgTable,
  uuid,
  text,
  jsonb,
  smallint,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  order: integer("order").notNull(),
  text: text("text").notNull(),
  options: jsonb("options").$type<string[]>().notNull(),
  active: boolean("active").notNull().default(true),
});

export const picks = pgTable("picks", {
  id: uuid("id").primaryKey().defaultRandom(),
  answers: jsonb("answers").$type<Record<string, string>>().notNull(),
  resultTmdbId: integer("result_tmdb_id"),
  resultTitle: text("result_title"),
  resultType: text("result_type"), // "movie" | "tv" | "anime"
  rationale: text("rationale"),
  feedback: smallint("feedback"), // -1 | null | 1
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
