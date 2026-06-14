import { createServerFn } from "@tanstack/react-start";
import { setCookie, getCookie, deleteCookie } from "@tanstack/react-start/server";
import { z } from "zod";
import { db } from "~/lib/db";
import { users } from "~/lib/db/schema";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export const loginServerFn = createServerFn({ method: "POST" })
  .validator((data: { username: string; password: string }) => 
    z.object({ username: z.string().min(1), password: z.string().min(1) }).parse(data)
  )
  .handler(async ({ data }) => {
    const { username, password } = data;
    const passwordHash = hashPassword(password);

    // Check if user exists
    let user = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    let isNewUser = false;

    if (user) {
      if (user.passwordHash !== passwordHash) {
        throw new Error("Invalid password.");
      }
    } else {
      // Create user
      const [newUser] = await db
        .insert(users)
        .values({
          username,
          passwordHash,
        })
        .returning();
      user = newUser;
      isNewUser = true;
    }

    // Set cookie
    setCookie("auth_session", user.id, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return { success: true, userId: user.id, isNewUser };
  });

export const logoutServerFn = createServerFn({ method: "POST" })
  .handler(async () => {
    deleteCookie("auth_session", { path: "/" });
    return { success: true };
  });

export const getSessionUserServerFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const sessionId = getCookie("auth_session");
    if (!sessionId) return null;

    const user = await db.query.users.findFirst({
      where: eq(users.id, sessionId),
    });

    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
    };
  });
