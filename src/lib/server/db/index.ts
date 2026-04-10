import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import * as schema from "./schema";
import * as authSchema from "./auth-schema";

import { DATABASE_URL } from "$env/static/private";

const { Pool } = pg;

const pool = new Pool({
  connectionString: DATABASE_URL,
});

export const db = drizzle(pool, {
  schema: { ...schema, ...authSchema },
});