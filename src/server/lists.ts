import { createServerFn } from "@tanstack/react-start";
import { db } from "~/lib/db";
import { picks } from "~/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getSessionUserServerFn } from "./auth";

export const getFolderItemsServerFn = createServerFn({ method: "GET" })
  .validator((type: "faves" | "watchlist" | "history") => type)
  .handler(async ({ data: type }) => {
    const user = await getSessionUserServerFn();
    if (!user) return [];

    let conditions;
    if (type === "faves") {
      conditions = and(eq(picks.userId, user.id), eq(picks.feedback, 1));
    } else if (type === "watchlist") {
      conditions = and(eq(picks.userId, user.id), eq(picks.inWatchlist, true));
    } else {
      conditions = eq(picks.userId, user.id);
    }

    const items = await db.query.picks.findMany({
      where: conditions,
      orderBy: (picks, { desc }) => [desc(picks.createdAt)],
    });

    return items.map(p => ({
      id: p.id,
      title: p.resultTitle || "Unknown Movie.exe",
      icon: "/file.png", // Or some generic file icon
      resultImdbId: p.resultImdbId,
      resultMalId: p.resultMalId,
      resultType: p.resultType,
    }));
  });
