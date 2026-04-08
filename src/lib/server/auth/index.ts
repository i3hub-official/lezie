// src/lib/server/auth/index.ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '$lib/server/db';
import * as authSchema from '$lib/server/db/auth-schema';

import 'dotenv/config';
import { config } from 'dotenv';

// Force reload .env file
config({ path: '.env', override: true });

// Debug logging
console.log('🔍 Checking environment...');
console.log('BETTER_AUTH_SECRET from process.env:', process.env.BETTER_AUTH_SECRET ? '✅ EXISTS' : '❌ MISSING');

if (!process.env.BETTER_AUTH_SECRET) {
    throw new Error('❌ Missing BETTER_AUTH_SECRET in environment variables');
}

export const auth = betterAuth({
  secret: BETTER_AUTH_SECRET,

  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: authSchema.authUsers,
      session: authSchema.sessions,
      account: authSchema.accounts,
      verification: authSchema.verifications,
    },
  }),

  trustedOrigins: [
    'http://localhost:5173',
    'http://localhost:3000',
    // Add your production domain here later, e.g.:
    // 'https://lezie.app'
  ],

  emailAndPassword: {
    enabled: true,
    // You can add password reset email logic here later
    // sendResetPassword: async (url, user) => { ... }
  },

  // Removed Google OAuth since you're using API key only
  // socialProviders: {}  ← Not needed now

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
  },

  advanced: {
    crossSubDomainCookies: true,
  }
});