import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as authSchema from './auth-schema';
import { DATABASE_URL } from '$env/static/private'; // Built-in SvelteKit env handling

// The client instance
const client = postgres(DATABASE_URL, {
  ssl: { rejectUnauthorized: false },
  prepare: false,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { 
  schema: {
    ...schema,
    ...authSchema,
  } 
});
