import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '$lib/server/db';
import * as authSchema from '$lib/server/db/auth-schema';
import { users, userProfiles, userPreferences } from '$lib/server/db/schema';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import { passkey } from 'better-auth/plugins/passkey';
import { eq } from 'drizzle-orm';
import {
  protectName,
} from '$lib/security/dataProtection';

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL || 'http://localhost:5173',
  secret: env.BETTER_AUTH_SECRET,

  logger: {
    level: dev ? 'debug' : 'error',
    enabled: dev,
  },

  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user:         authSchema.authUsers,
      session:      authSchema.sessions,
      account:      authSchema.accounts,
      verification: authSchema.verifications,
    },
  }),

  plugins: [
    passkey()
  ],

  // Custom fields added to the session/user object
  user: {
    additionalFields: {
      username:    { type: 'string' },
      phoneNumber: { type: 'string' },
      pin:         { type: 'string' },
    }
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
  },

  advanced: {
    backgroundTasks: {
      enabled: true,
    },
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const startTime = Date.now();
          try {
            // Split name for profile storage
            const nameParts = user.name?.split(' ') || [];
            const firstName = nameParts[0] || '';
            const lastName  = nameParts.slice(1).join(' ') || '';

            /**
             * 1. Create Core App User
             * Maps the Better Auth 'text' ID to our app's user table.
             */
            await db.insert(users).values({
              id:         user.id as any, // Cast to any to bypass UUID strictness if using Nanoids
              hashable:   user.id,        
              email:      user.email,
              phone:      (user as any).phoneNumber ?? null,
              username:   (user as any).username    ?? null,
              tier:       '1',
              trustScore: 0,
              kycStatus:  'pending',
              isActive:   true,
              lastActive: new Date(),
            }).onConflictDoNothing();

            /**
             * 2. Create Encrypted User Profile
             * Uses Tier 2/3 protection. We use user.id as the Context ID (AAD)
             * to cryptographically bind this profile to this specific user.
             */
            await db.insert(userProfiles).values({
              userId:    user.id as any,
              firstName: firstName ? protectName(firstName) : null,
              lastName:  lastName  ? protectName(lastName)  : null,
              updatedAt: new Date(),
            }).onConflictDoNothing();

            /**
             * 3. Create Default Preferences
             * Non-PII data, stored in plaintext.
             */
            await db.insert(userPreferences).values({
              userId:         user.id as any,
              alertRadius:    5,
              notifyCritical: true,
              notifyHigh:     true,
            }).onConflictDoNothing();

            if (dev) {
              const duration = Date.now() - startTime;
              console.log(`[AUTH:SYNC] ✅ Successfully synced profile for ${user.email} (${duration}ms)`);
            }
          } catch (error) {
            console.error(`[AUTH:SYNC] ❌ Critical failure during user sync for ${user.id}:`, error);
            // In production, you might want to trigger an alert/sentry event here
          }
        },
      },
    },
  },

  trustedOrigins: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://lezie.vercel.app',
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24,      // Refresh session every 24 hours
  },
});
