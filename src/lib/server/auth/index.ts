// src/lib/server/auth.ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '$lib/server/db';
import * as authSchema from '$lib/server/db/auth-schema';
import { users, userProfiles, userPreferences } from '$lib/server/db/schema';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import { passkey } from 'better-auth/plugins/passkey';

import { sendEmail } from '$lib/server/email/sender';
import {
  verificationEmailTemplate,
  passwordResetTemplate,
  welcomeEmailTemplate,
} from '$lib/server/email/templates';

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL || 'http://localhost:5173',
  secret:  env.BETTER_AUTH_SECRET || 'c0ed822af57f5cfa11c3f74e....c95764',

  logger: {
    level:   dev ? 'debug' : 'error',
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

  plugins: [passkey()],

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
    requireEmailVerification: true,

    sendVerificationEmail: async ({ user, url }) => {
      if (dev) console.log(`[AUTH] Verification -> ${user.email} : ${url}`);
      const { subject, html } = verificationEmailTemplate({ url, name: user.name });
      await sendEmail({ to: user.email, subject, html });
    },

    sendResetPassword: async ({ user, url }) => {
      if (dev) console.log(`[AUTH] Password reset -> ${user.email} : ${url}`);
      const { subject, html } = passwordResetTemplate({ url, name: user.name });
      await sendEmail({ to: user.email, subject, html });
    },
  },

  advanced: {
    backgroundTasks: { enabled: true },
    cookies: {
      session_token: {
        name: 'better-auth.session_token',
        options: { httpOnly: true, sameSite: 'lax', secure: !dev, path: '/' }
      }
    }
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (dev) console.log(`[AUTH:SYNC] Starting sync for: ${user.email}`);
        },
        after: async (user) => {
          const startTime = Date.now();
          try {
            const nameParts = user.name?.split(' ') || [];
            const firstName = nameParts[0] || '';
            const lastName  = nameParts.slice(1).join(' ') || '';

            await db.insert(users).values({
              id: user.id as any, email: user.email,
              phone: (user as any).phoneNumber ?? null,
              username: (user as any).username ?? null,
              tier: '1', trustScore: 0, kycStatus: 'pending',
              isActive: true, lastActive: new Date(),
            }).onConflictDoNothing();

            await db.insert(userProfiles).values({
              userId: user.id as any, firstName, lastName, updatedAt: new Date(),
            }).onConflictDoNothing();

            await db.insert(userPreferences).values({
              userId: user.id as any, alertRadius: 5,
              notifyCritical: true, notifyHigh: true,
            }).onConflictDoNothing();

            if (dev) console.log(`[AUTH:SYNC] Synced ${user.id} (${Date.now() - startTime}ms)`);
          } catch (error) {
            console.error(`[AUTH:SYNC] Failed for ${user.id}:`, error);
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
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },
});
