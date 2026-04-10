import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { DATABASE_URL } from "$env/static/private";
import { dev } from "$app/environment"; // Import the dev flag
import * as schema from "./schema";
import * as authSchema from "./auth-schema";

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is missing from .env");
}

const sql = neon(DATABASE_URL);

/**
 * Enhanced Drizzle Configuration
 */
export const db = drizzle({ 
  client: sql, 
  schema: { ...schema, ...authSchema },
  // Only enable the logger if we are in the development environment
  logger: dev ? {
    logQuery(query, params) {
      const sqlSnippet = query.substring(0, 100).replace(/\s+/g, ' ');
      console.log(`[DB:SQL] 📝 ${sqlSnippet}${query.length > 100 ? '...' : ''}`);
      if (params.length > 0) {
        console.log(`[DB:PARAMS] 📥 ${JSON.stringify(params).substring(0, 150)}`);
      }
    }
  } : false // Set to false in production
});
