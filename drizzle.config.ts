import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/server/db/schema.ts", // path to your schema
  out: "./drizzle",                         // path for generated migration files
  dialect: "postgresql",                     // MUST specify
  dbCredentials: {
    url: process.env.DATABASE_URL!
  },
verbose: true,
strict: true,
});



