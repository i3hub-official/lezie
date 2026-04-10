import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '$lib/server/db';
import * as authSchema from '$lib/server/db/auth-schema';
import { users, userProfiles } from '$lib/server/db/schema';
import { env } from '$env/dynamic/private';

export const auth = betterAuth({
  // Ensure this is 32+ characters in your .env
  secret: env.BETTER_AUTH_SECRET || 'dev-secret-key-at-least-32-characters-long-12345',
  
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
  },

  // FIXED: Correct nesting: databaseHooks -> user -> create -> after
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            // 1. Sync to the 'users' app table
            await db.insert(users).values({
              id: user.id, // This is a string from Better Auth
              email: user.email,
              tier: '1',
              trustScore: 0,
              kycStatus: 'pending',
              isActive: true,
            }).onConflictDoNothing();

            // 2. Initialize the user profile
            await db.insert(userProfiles).values({
              userId: user.id,
              firstName: user.name?.split(' ')[0] || '',
              lastName: user.name?.split(' ').slice(1).join(' ') || '',
            }).onConflictDoNothing();

            console.log('✅ Success: User and Profile synced:', user.id);
          } catch (error) {
            console.error('❌ Database Sync Error:', error);
          }
        },
      },
    },
  },

  trustedOrigins: [
    'http://localhost:5173',
    'http://lezie.vercel.app'
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
  },

  advanced: {
    crossSubDomainCookies: true,
  },
});
