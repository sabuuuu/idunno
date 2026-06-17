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

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  order: integer("order").notNull(),
  text: text("text").notNull(),
  options: jsonb("options").$type<string[]>().notNull(),
  active: boolean("active").notNull().default(true),
});

export const picks = pgTable("picks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  answers: jsonb("answers").$type<Record<string, string>>().notNull(),
  resultImdbId: text("result_imdb_id"),
  resultMalId: integer("result_mal_id"),
  resultTitle: text("result_title"),
  resultType: text("result_type"),
  rationale: text("rationale"),
  feedback: smallint("feedback"),
  convincePitch: text("convince_pitch"),
  inWatchlist: boolean("in_watchlist").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
