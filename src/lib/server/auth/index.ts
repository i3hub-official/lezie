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
import {
  protectEmail,
  protectPhone,
  protectUsername,
  revealEmail,
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
      username:    { type: 'string' },
      phoneNumber: { type: 'string' },
      pin:         { type: 'string' },
      // Hash columns — computed in the before hook and written by Better Auth.
      // Declared here so Better Auth includes them in its INSERT payload.
      emailHash:    { type: 'string', required: false },
      phoneHash:    { type: 'string', required: false },
      usernameHash: { type: 'string', required: false },
    }
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true,

    sendResetPassword: async ({ user, url }) => {
      const plainEmail = revealEmail(user.email);
      if (dev) console.log(`[AUTH] Password reset -> ${plainEmail} : ${url}`);
      const { subject, html } = passwordResetTemplate({ url, name: user.name });
      await sendEmail({ to: plainEmail, subject, html });
    },
  },

  // emailVerification must be a top-level key for auth.api.sendVerificationEmail
  // and the /api/auth/send-verification-email endpoint to work correctly.
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      // user.email is the encrypted value — decrypt it before sending.
      // The before hook replaced the plaintext email with its ciphertext,
      // so we must reverse that here to get the real recipient address.
      const plainEmail = revealEmail(user.email);

      // Rewrite the verification URL to point to our custom /verify page.
      // Better Auth generates: /api/auth/verify-email?token=...
      // We redirect that to:   /verify?token=...
      const token     = new URL(url).searchParams.get('token') ?? '';
      const base      = new URL(url).origin;
      const verifyUrl = `${base}/verify?token=${encodeURIComponent(token)}`;

      if (dev) console.log(`[AUTH] Verification -> ${plainEmail} : ${verifyUrl}`);
      const { subject, html } = verificationEmailTemplate({ url: verifyUrl, name: user.name });
      await sendEmail({ to: plainEmail, subject, html });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
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
          if (dev) console.log(`[AUTH:SYNC] ⏳ Starting sync for: ${user.email}`);

          // Better Auth knows nothing about our hash columns.
          // We must compute and inject them here — before the INSERT —
          // otherwise email_hash (NOT NULL) causes the insert to fail.
          const emailResult = await protectEmail(user.email);

          const phoneRaw = (user as any).phoneNumber as string | undefined;
          const phoneResult = phoneRaw ? await protectPhone(phoneRaw) : null;

          const usernameRaw = (user as any).username as string | undefined;
          const usernameResult = usernameRaw ? await protectUsername(usernameRaw) : null;

          return {
            data: {
              ...user,
              // Encrypted values replace the plaintext columns
              email:       emailResult.encrypted,
              phoneNumber: phoneResult?.encrypted  ?? (user as any).phoneNumber,
              username:    usernameResult?.encrypted ?? (user as any).username,
              // Hash columns — used for all lookups (WHERE queries)
              emailHash:    emailResult.searchHash,
              phoneHash:    phoneResult?.searchHash  ?? null,
              usernameHash: usernameResult?.searchHash ?? null,
            },
          };
        },
        after: async (user) => {
          const startTime = Date.now();
          try {
            const { nanoid } = await import('nanoid');
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

            // userProfiles.id and userPreferences.id have no DB default —
            // generate NanoIDs explicitly to match the app-wide pattern.
            await db.insert(userProfiles).values({
              id: nanoid(), userId: user.id as any,
              firstName, lastName, updatedAt: new Date(),
            }).onConflictDoNothing();

            await db.insert(userPreferences).values({
              id: nanoid(), userId: user.id as any,
              alertRadius: 5, notifyCritical: true, notifyHigh: true,
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
