// src/lib/server/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as authSchema from './auth-schema';

// Get database URL from environment
let databaseUrl = process.env.DATABASE_URL;

// If not found, try to load from .env manually
if (!databaseUrl) {
  console.warn('⚠️ DATABASE_URL not in process.env, trying to load .env');
  const dotenv = await import('dotenv');
  const { config } = dotenv;
  const result = config({ path: '.env' });
  
  if (result.parsed?.DATABASE_URL) {
    databaseUrl = result.parsed.DATABASE_URL;
    console.log('✅ Loaded DATABASE_URL from .env file');
  }
}

// Final validation
if (!databaseUrl) {
  console.error('❌ DATABASE_URL is not set');
  console.error('Available env keys:', Object.keys(process.env).filter(k => k.includes('DATABASE')));
  throw new Error('DATABASE_URL environment variable is required');
}

// Mask password for logging
const maskedUrl = databaseUrl.replace(/:[^:@]*@/, ':****@');
console.log('📊 Connecting to database:', maskedUrl);

// Create postgres connection with proper SSL for cloud databases
const client = postgres(databaseUrl, {
  ssl: {
    rejectUnauthorized: false, // Required for some cloud databases
  },
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create drizzle instance
export const db = drizzle(client, { 
  schema: {
    ...schema,
    ...authSchema,
  } 
});

console.log('✅ Database connected successfully');