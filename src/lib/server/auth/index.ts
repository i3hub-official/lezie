import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '$lib/server/db';
import * as authSchema from '$lib/server/db/auth-schema';
import { users, userProfiles, userPreferences } from '$lib/server/db/schema';
import { env } from '$env/dynamic/private';

export const auth = betterAuth({
  // Fallback to localhost if ENV is missing to prevent the "Base URL" warning
  baseURL: env.BETTER_AUTH_URL || 'http://localhost:5173',
  secret: env.BETTER_AUTH_SECRET || 'c0ed822af57f5cfa11cf49010fd02cd67c3f74e1904f7e24f13d41c95764a551',

  // 1. BUILT-IN LOGGER: Set to 'debug' for dev, 'info' or 'error' for production
  logger: {
    level: "debug", 
    enabled: true,
  },

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
    autoSignIn: true,
  },

  advanced: {
    backgroundTasks: {
      enabled: true,
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
           console.log(`[AUTH:SYNC] ⏳ Starting sync for new user: ${user.email}`);
        },
        after: async (user) => {
          const startTime = Date.now();
          try {
            // 1. Create main app user record
            await db.insert(users).values({
              id: user.id,
              email: user.email,
              tier: '1',
              trustScore: 0,
              kycStatus: 'pending',
              isActive: true,
              lastActive: new Date(),
            }).onConflictDoNothing();

            // 2. Create the user profile
            const firstName = user.name?.split(' ')[0] || '';
            const lastName = user.name?.split(' ').slice(1).join(' ') || '';

            await db.insert(userProfiles).values({
              userId: user.id,
              firstName,
              lastName,
              updatedAt: new Date(),
            }).onConflictDoNothing();

            // 3. Initialize default preferences
            await db.insert(userPreferences).values({
              userId: user.id,
              alertRadius: 5,
              notifyCritical: true,
              notifyHigh: true,
            }).onConflictDoNothing();

            const duration = Date.now() - startTime;
            console.log(`[AUTH:SYNC] ✅ Successfully synced tables for ${user.id} (${duration}ms)`);
          } catch (error) {
            console.error(`[AUTH:SYNC] ❌ Critical failure syncing user ${user.id}:`, error);
          }
        },
      },
    },
  },

  trustedOrigins: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://lezie.vercel.app'
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 30, 
    updateAge: 60 * 60 * 24,      
  },
});
