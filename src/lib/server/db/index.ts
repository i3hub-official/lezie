import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from '$env/static/private';
import * as schema from './schema';
import * as authSchema from './auth-schema';
import * as communitySchema from './community-schema'; // Fixed: use camelCase or underscore

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is missing from .env');
}

const sql = neon(DATABASE_URL, {
  fetchOptions: {
    cache: 'no-store',
  },
});

export const db = drizzle({
  client: sql,
  schema: { ...schema, ...authSchema, ...communitySchema }, // Fixed: use the imported variable
});