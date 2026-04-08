import { defineConfig } from "drizzle-kit";
import { env } from "$env/dynamic/private"; // Using SvelteKit's env if available, or process.env

export default defineConfig({
  // Point to both your main schema and your auth schema
  schema: [
    "./src/lib/server/db/schema.ts",
    "./src/lib/server/db/auth-schema.ts"
  ], 
  out: "./drizzle",
  dialect: "sqlite", // Turso uses the SQLite dialect
  driver: "turso",   // Specifically tell Drizzle you are using Turso
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  verbose: true,
  strict: true,
});
