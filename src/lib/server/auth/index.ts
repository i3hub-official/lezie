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
} from '$lib/server/email/templates';
import {
  protectEmail,
  protectPhone,
  protectUsername,
} from '$lib/security/dataProtection';

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL || 'http://localhost:5173',
  secret:  env.BETTER_AUTH_SECRET || '89e998e6034644edb1be296a3685791c',

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
      username:    { type: 'string', required: false },
      phoneNumber: { type: 'string', required: false },
      pin:         { type: 'string', required: false },
    }
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true,

    sendResetPassword: async ({ user, url }) => {
      if (dev) console.log(`[AUTH] Password reset -> ${user.email}`);
      const { subject, html } = passwordResetTemplate({ url, name: user.name });
      await sendEmail({ to: user.email, subject, html });
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const token     = new URL(url).searchParams.get('token') ?? '';
      const verifyUrl = `${new URL(url).origin}/verify?token=${encodeURIComponent(token)}`;
      if (dev) console.log(`[AUTH] Verification -> ${user.email} : ${verifyUrl}`);
      const { subject, html } = verificationEmailTemplate({ url: verifyUrl, name: user.name });
      await sendEmail({ to: user.email, subject, html });
    },
    sendOnSignUp:                true,
    autoSignInAfterVerification: true,
  },

  advanced: {
    backgroundTasks: { enabled: true },
    cookies: {
      session_token: {
        name:    'better-auth.session_token',
        options: { httpOnly: true, sameSite: 'lax', secure: !dev, path: '/' }
      }
    }
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (dev) console.log(`[AUTH:SYNC] ⏳ New user: ${user.email}`);
          // No encryption — Better Auth owns authUsers and needs plaintext email.
        },

        after: async (user) => {
          const startTime = Date.now();
          try {
            const { nanoid } = await import('nanoid');
            const nameParts  = user.name?.split(' ') || [];
            const firstName  = nameParts[0] || '';
            const lastName   = nameParts.slice(1).join(' ') || '';

            // Encrypt PII in your own users table — full control here
            const emailResult    = await protectEmail(user.email);
            const phoneRaw       = (user as any).phoneNumber as string | undefined;
            const phoneResult    = phoneRaw ? await protectPhone(phoneRaw) : null;
            const usernameRaw    = (user as any).username as string | undefined;
            const usernameResult = usernameRaw ? await protectUsername(usernameRaw) : null;

            await db.insert(users).values({
              id:           user.id as any,
              email:        emailResult.encrypted,
              emailHash:    emailResult.searchHash,
              phone:        phoneResult?.encrypted    ?? null,
              phoneHash:    phoneResult?.searchHash   ?? null,
              username:     usernameResult?.encrypted  ?? null,
              usernameHash: usernameResult?.searchHash ?? null,
              tier:         '1',
              trustScore:   0,
              kycStatus:    'pending',
              isActive:     true,
              lastActive:   new Date(),
            }).onConflictDoNothing();

            await db.insert(userProfiles).values({
              id:        nanoid(),
              userId:    user.id as any,
              firstName,
              lastName,
              updatedAt: new Date(),
            }).onConflictDoNothing();

            await db.insert(userPreferences).values({
              id:             nanoid(),
              userId:         user.id as any,
              alertRadius:    5,
              notifyCritical: true,
              notifyHigh:     true,
            }).onConflictDoNothing();

            if (dev) console.log(`[AUTH:SYNC] ✅ Synced ${user.id} (${Date.now() - startTime}ms)`);
          } catch (error) {
            console.error(`[AUTH:SYNC] ❌ Failed for ${user.id}:`, error);
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
    expiresIn:   60 * 60 * 24 * 30,
    updateAge:   60 * 60 * 24,
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },
});
