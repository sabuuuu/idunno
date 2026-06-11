import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { db } from "~/lib/db";
import { questions } from "~/lib/db/schema";

export const getQuestions = createServerFn({ method: "GET" }).handler(
  async () => {
    return db
      .select()
      .from(questions)
      .where(eq(questions.active, true))
      .orderBy(asc(questions.order));
  },
);
