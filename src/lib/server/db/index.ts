import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as authSchema from './auth-schema';
import { config } from 'dotenv';

config({ path: '.env', override: true });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required in .env');
}

const connectionString = process.env.DATABASE_URL;

// Use prepare:false to avoid issues with Supabase pooler
const client = postgres(connectionString, {
  ssl: { rejectUnauthorized: false }, // safe for Termux / mobile
  prepare: false,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Merge schemas
export const db = drizzle(client, { 
  schema: {
    ...schema,
    ...authSchema,
  } 
});

console.log('✅ Database connected successfully');