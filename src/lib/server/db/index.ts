import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";
import * as authSchema from "./auth-schema";

// Vite uses import.meta.env instead of process.env
const databaseUrl = process.env.DATABASE_URL || import.meta.env.VITE_DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const sql = neon(databaseUrl);

export const db = drizzle({ 
  client: sql, 
  schema: { ...schema, ...authSchema } 
});
