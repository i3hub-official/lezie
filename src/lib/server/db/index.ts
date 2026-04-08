// src/lib/server/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as authSchema from './auth-schema';

import 'dotenv/config';
import { config } from 'dotenv';

// Force reload .env file (same as auth/index.ts)
config({ path: '.env', override: true });

// Debug logging (same pattern as auth)
console.log('🔍 Checking database environment...');
console.log('DATABASE_URL from process.env:', process.env.DATABASE_URL ? '✅ EXISTS' : '❌ MISSING');

// Get database URL with same validation pattern
let DATABASE_URL: string;

if (process.env.DATABASE_URL) {
  DATABASE_URL = process.env.DATABASE_URL;
  console.log('✅ Using DATABASE_URL from process.env');
}
// Fallback for development (same pattern as auth)
else if (process.env.NODE_ENV !== 'production') {
  console.warn('⚠️ WARNING: Using development fallback database!');
  console.warn('⚠️ Set DATABASE_URL in production!');
  // You can add a local SQLite fallback or throw error
  throw new Error('DATABASE_URL is required even in development');
}
else {
  throw new Error('❌ Missing DATABASE_URL in environment variables');
}

// Mask the URL for logging (hide password)
const maskedUrl = DATABASE_URL.replace(/:[^:@]*@/, ':****@');
console.log('📊 Connecting to database:', maskedUrl);

// Create postgres connection
const client = postgres(DATABASE_URL, {
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create drizzle instance with both schemas
export const db = drizzle(client, { 
  schema: {
    ...schema,
    ...authSchema,
  } 
});

console.log('✅ Database connected successfully');