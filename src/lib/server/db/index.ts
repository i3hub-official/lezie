import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { DATABASE_URL } from "$env/static/private"; // Use SvelteKit's env handler
import * as schema from "./schema";
import * as authSchema from "./auth-schema";

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is missing from .env");
}

const sql = neon(DATABASE_URL);

export const db = drizzle({ 
  client: sql, 
  schema: { ...schema, ...authSchema } 
});
