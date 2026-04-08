// src/lib/server/auth/index.ts
import { betterAuth } from 'better-auth';
import 'dotenv/config';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '$lib/server/db';
import * as authSchema from '$lib/server/db/auth-schema';

// ✅ Early validation
const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET;

if (!BETTER_AUTH_SECRET) {
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