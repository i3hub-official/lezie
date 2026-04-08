import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client/web'; // Use /web to bypass native driver issues in Termux
import * as schema from './schema';
import * as authSchema from './auth-schema';
import { DATABASE_URL, DATABASE_AUTH_TOKEN } from '$env/static/private';

const client = createClient({
  url: DATABASE_URL,
  authToken: DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { 
  schema: { ...schema, ...authSchema } 
});
