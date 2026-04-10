import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '$lib/server/db';
import * as authSchema from '$lib/server/db/auth-schema';
import { users, userProfiles, userPreferences } from '$lib/server/db/schema';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import { passkey } from 'better-auth/plugins'; // 1. Import Passkey plugin

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL || 'http://localhost:5173',
  secret: env.BETTER_AUTH_SECRET || 'c0ed822af57f5cfa11cf49010fd02cd67c3f74e1904f7e24f13d41c95764a551',

  logger: {
    level: dev ? "debug" : "error", 
    enabled: dev,
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

  // 2. Enable Plugins
  plugins: [
    passkey()
  ],

  // 3. Define Custom Fields for Identifiers
  user: {
    additionalFields: {
      username: { type: "string" },
      phoneNumber: { type: "string" },
      pin: { type: "string" } 
    }
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    // Allows us to handle the login via multiple identifiers 
    // manually in a resolver if needed
    requireEmailVerification: false 
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
           if (dev) console.log(`[AUTH:SYNC] ⏳ Starting sync for new user: ${user.email}`);
        },
        after: async (user) => {
          const startTime = Date.now();
          try {
            // Map the name parts safely
            const nameParts = user.name?.split(' ') || [];
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            // Sync with your Lezie application tables
            await db.insert(users).values({
              id: user.id,
              email: user.email,
              tier: '1',
              trustScore: 0,
              kycStatus: 'pending',
              isActive: true,
              lastActive: new Date(),
            }).onConflictDoNothing();

            await db.insert(userProfiles).values({
              userId: user.id,
              firstName,
              lastName,
              updatedAt: new Date(),
            }).onConflictDoNothing();

            await db.insert(userPreferences).values({
              userId: user.id,
              alertRadius: 5,
              notifyCritical: true,
              notifyHigh: true,
            }).onConflictDoNothing();

            if (dev) {
              const duration = Date.now() - startTime;
              console.log(`[AUTH:SYNC] ✅ Successfully synced tables for ${user.id} (${duration}ms)`);
            }
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
