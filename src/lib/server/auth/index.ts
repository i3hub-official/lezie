import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '$lib/server/db';
import * as authSchema from '$lib/server/db/auth-schema';
import { users, userProfiles, userPreferences } from '$lib/server/db/schema';
import { env } from '$env/dynamic/private';

export const auth = betterAuth({
  // Ensure BETTER_AUTH_SECRET is set in your .env
  secret: env.BETTER_AUTH_SECRET || 'a-very-secure-fallback-secret-32-chars-long',

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
    autoSignIn: true, // Automatically sign in after sign up
  },

  // SPEED FIX: Enable background tasks so hooks don't block the response
  advanced: {
    backgroundTasks: {
      enabled: true,
    },
  },

  // DATABASE SYNC LOGIC
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          /**
           * We perform these inserts as a "fire-and-forget" block 
           * to keep the signup response time fast.
           */
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

            // 2. Create the user profile (pulling name from Better Auth)
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
              alertRadius: 5, // Default 5km
              notifyCritical: true,
              notifyHigh: true,
            }).onConflictDoNothing();

            console.log(`📡 Lezie Sync: Profile & Preferences created for ${user.id}`);
          } catch (error) {
            // Log the error but don't crash the auth process
            console.error('❌ Sync Hook Error:', error);
          }
        },
      },
    },
  },

  // SECURITY & COOKIES
  trustedOrigins: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://lezie.vercel.app'
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24,      // Refresh session every 24 hours
  },
});
