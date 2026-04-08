import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: [
    "./src/lib/server/db/schema.ts",
    "./src/lib/server/db/auth-schema.ts"
  ], 
  out: "./drizzle",
  dialect: "sqlite", // Keep this
  // REMOVE the 'driver' line entirely
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  verbose: true,
  strict: true,
});
