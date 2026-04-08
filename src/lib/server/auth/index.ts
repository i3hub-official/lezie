// src/lib/server/auth/index.ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '$lib/server/db';
import * as authSchema from '$lib/server/db/auth-schema';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

let BETTER_AUTH_SECRET: string;

if (process.env.BETTER_AUTH_SECRET) {
  BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET;
} else if (process.env.NODE_ENV !== 'production') {
  console.warn('⚠️ WARNING: Using development fallback secret!');
  BETTER_AUTH_SECRET = 'dev-secret-key-minimum-32-characters-long!!!!!';
} else {
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
  
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(url, user) {
      // Optional: Implement password reset email
    },
  },
  
  // Hook to sync users with your app's users table
  hooks: {
    after: {
      async createUser(user, ctx) {
        // When a user is created in Better Auth, also create in your app's users table
        try {
          await db.insert(users).values({
            id: user.id, // Use the same ID
            email: user.email,
            tier: '1',
            trustScore: 0,
            kycStatus: 'pending',
            isActive: true,
          }).onConflictDoNothing();
          console.log('✅ User synced to app users table:', user.id);
        } catch (error) {
          console.error('Failed to sync user:', error);
        }
      },
    },
  },
  
  trustedOrigins: [
    'http://localhost:5173',
    'http://lezie.vercel.app'
  ],
  
  session: {
    expiresIn: 60 * 60 * 24 * 30,
  },
  
  advanced: {
    crossSubDomainCookies: true,
  },
});