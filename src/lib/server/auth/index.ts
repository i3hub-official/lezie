// src/lib/server/auth/index.ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '$lib/server/db';
import * as authSchema from '$lib/server/db/auth-schema';

// Try multiple ways to get the secret
let BETTER_AUTH_SECRET: string;

// Method 1: Check process.env
if (process.env.BETTER_AUTH_SECRET) {
  BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET;
  console.log('✅ Using BETTER_AUTH_SECRET from process.env');
}
// Method 2: Check globalThis for Vite injected vars
else if ((globalThis as any).BETTER_AUTH_SECRET) {
  BETTER_AUTH_SECRET = (globalThis as any).BETTER_AUTH_SECRET;
  console.log('✅ Using BETTER_AUTH_SECRET from globalThis');
}
// Method 3: Use a development fallback (ONLY FOR TESTING)
else if (process.env.NODE_ENV !== 'production') {
  console.warn('⚠️ WARNING: Using development fallback secret!');
  console.warn('⚠️ Set BETTER_AUTH_SECRET in production!');
  BETTER_AUTH_SECRET = 'dev-secret-key-minimum-32-characters-long!!!!!';
}
else {
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
  ],

  emailAndPassword: {
    enabled: true,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30,
  },

  advanced: {
    crossSubDomainCookies: true,
  }
});