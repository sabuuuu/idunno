import type { questions, picks } from "~/lib/db/schema";

export type Question = typeof questions.$inferSelect;
export type Pick = typeof picks.$inferSelect;
