import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { DATABASE_URL } from "$env/static/private";
import * as schema from "./schema";
import * as authSchema from "./auth-schema";

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is missing from .env");
}

const sql = neon(DATABASE_URL);

/**
 * Enhanced Drizzle Configuration
 * We add a 'logger' to see every SQL statement in the Termux console.
 */
export const db = drizzle({ 
  client: sql, 
  schema: { ...schema, ...authSchema },
  // 1. Enable SQL Logging
  logger: {
    logQuery(query, params) {
      // Clean up the SQL string for better readability in small terminals
      const sqlSnippet = query.substring(0, 100).replace(/\s+/g, ' ');
      console.log(`[DB:SQL] 📝 ${sqlSnippet}${query.length > 100 ? '...' : ''}`);
      if (params.length > 0) {
        // Only log small param sets to avoid terminal flooding
        console.log(`[DB:PARAMS] 📥 ${JSON.stringify(params).substring(0, 150)}`);
      }
    }
  }
});
