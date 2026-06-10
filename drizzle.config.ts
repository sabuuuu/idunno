import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // drizzle-kit uses DIRECT_URL (port 5432) to run migrations
    url: process.env.DIRECT_URL!,
  },
});
