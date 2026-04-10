import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '$lib/server/db';
import * as authSchema from '$lib/server/db/auth-schema';
import { users, userProfiles, userPreferences } from '$lib/server/db/schema';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import { passkey } from 'better-auth/plugins/passkey';
import {
  protectName,
  searchHashFor,
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

  // IMPORTANT: All columns in the 'user' table must be defined here 
  // if they are not standard Better Auth fields.
  user: {
    additionalFields: {
      username:     { type: 'string' },
      phoneNumber:  { type: 'string' },
      pin:          { type: 'string' },
      emailHash:    { type: 'string' },
      usernameHash: { type: 'string' },
      phoneHash:    { type: 'string' },
    }
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
  },

  databaseHooks: {
    user: {
      create: {
        /**
         * BEFORE: Populates the email_hash column so the 
         * NOT NULL constraint in the DB is satisfied.
         */
        before: async (user) => {
          const emailHash = searchHashFor(user.email, 'email');
          const rawUsername = (user as any).username;
          const rawPhone = (user as any).phoneNumber;

          return {
            data: {
              ...user,
              emailHash: emailHash,
              usernameHash: rawUsername ? searchHashFor(rawUsername, 'username') : null,
              phoneHash: rawPhone ? searchHashFor(rawPhone, 'phone') : null,
            }
          };
        },

        /**
         * AFTER: Syncs the account to the application-level tables.
         */
        after: async (user) => {
          const startTime = Date.now();
          try {
            const nameParts = user.name?.split(' ') || [];
            const firstName = nameParts[0] || '';
            const lastName  = nameParts.slice(1).join(' ') || '';

            // 1. Core User Record
            await db.insert(users).values({
              id:         user.id as any,
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

            // 2. Encrypted Profile
            await db.insert(userProfiles).values({
              userId:    user.id as any,
              firstName: firstName ? protectName(firstName) : null,
              lastName:  lastName  ? protectName(lastName)  : null,
              updatedAt: new Date(),
            }).onConflictDoNothing();

            // 3. User Preferences
            await db.insert(userPreferences).values({
              userId:         user.id as any,
              alertRadius:    5,
              notifyCritical: true,
              notifyHigh:     true,
            }).onConflictDoNothing();

            if (dev) {
              console.log(`[AUTH:SYNC] ✅ Synced tables for ${user.email} (${Date.now() - startTime}ms)`);
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
    'https://lezie.vercel.app',
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
});
