import { createServerFn } from "@tanstack/react-start";
import { db } from "~/lib/db";
import { questions } from "~/lib/db/schema";

/**
 * Phase 0 health check — verifies the DB connection is alive.
 * Called from the root loader; throws if the DB is unreachable.
 */
export const healthCheck = createServerFn({ method: "GET" }).handler(
  async () => {
    await db.select().from(questions).limit(1);
    return { ok: true } as const;
  },
);
