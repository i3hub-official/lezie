import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '$lib/server/db';
import * as authSchema from '$lib/server/db/auth-schema';
import { users, userProfiles, userPreferences } from '$lib/server/db/schema';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import { passkey } from 'better-auth/plugins/passkey';

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL || 'http://localhost:5173',
  secret: env.BETTER_AUTH_SECRET || 'c0ed822af57f5cfa11c3f74e....c95764',

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

  // Custom fields — must match columns added to authUsers in auth-schema.ts
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
        before: async (user) => {
          if (dev) console.log(`[AUTH:SYNC] ⏳ Starting sync for new user: ${user.email}`);
        },
        after: async (user) => {
          const startTime = Date.now();
          try {
            const nameParts = user.name?.split(' ') || [];
            const firstName = nameParts[0] || '';
            const lastName  = nameParts.slice(1).join(' ') || '';

            // NOTE: users.id is uuid but Better Auth generates a text ID.
            // We cast user.id as uuid — ensure your DB accepts this or
            // change users.id to text('id') in schema.ts.
            await db.insert(users).values({
              id:          user.id as any, // Better Auth text ID cast to uuid
              email:       user.email,
              phone:       (user as any).phoneNumber ?? null,
              username:    (user as any).username    ?? null,
              tier:        '1',
              trustScore:  0,
              kycStatus:   'pending',
              isActive:    true,
              lastActive:  new Date(),
            }).onConflictDoNothing();

            await db.insert(userProfiles).values({
              userId:    user.id as any,
              firstName,
              lastName,
              updatedAt: new Date(),
            }).onConflictDoNothing();

            await db.insert(userPreferences).values({
              userId:         user.id as any,
              alertRadius:    5,
              notifyCritical: true,
              notifyHigh:     true,
            }).onConflictDoNothing();

            if (dev) {
              const duration = Date.now() - startTime;
              console.log(`[AUTH:SYNC] ✅ Synced tables for ${user.id} (${duration}ms)`);
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
    'https://lezie.vercel.app',   // fixed: was http
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge:  60 * 60 * 24,
  },
});