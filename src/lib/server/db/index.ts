// src/lib/server/db/index.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from '$env/static/private';
import * as schema from './schema';
import * as authSchema from './auth-schema';

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is missing from .env');
}

// Create SQL client with better timeout and retry options
const sql = neon(DATABASE_URL, {
  fetchOptions: {
    cache: 'no-store',
    // Add timeout to prevent hanging requests
    signal: AbortSignal.timeout(30000), // 30 seconds timeout
  },
  // Add retry logic for better reliability
  retry: {
    attempts: 3,
    delay: (attempt) => Math.min(1000 * Math.pow(2, attempt), 10000), // Exponential backoff: 1s, 2s, 4s
  },
  // Log queries in development
  ...(process.env.NODE_ENV === 'development' && {
    logger: (message: string) => console.log('[DB Query]', message),
  }),
});

// Create drizzle instance with schema
export const db = drizzle({
  client: sql,
  schema: { ...schema, ...authSchema },
});

// Export a health check function
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1 as connected`;
    return true;
  } catch (error) {
    console.error('[DB] Connection check failed:', error);
    return false;
  }
}

// Export a utility to get a fresh connection for critical operations
export async function getFreshConnection() {
  const freshSql = neon(DATABASE_URL, {
    fetchOptions: {
      cache: 'no-store',
      signal: AbortSignal.timeout(15000), // 15 seconds for fresh connections
    },
    retry: {
      attempts: 2,
      delay: 500,
    },
  });
  
  return drizzle({
    client: freshSql,
    schema: { ...schema, ...authSchema },
  });
}