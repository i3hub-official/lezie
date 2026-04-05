import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '$lib/server/db';
import * as authSchema from '$lib/server/db/auth-schema';

// ✅ Validate env early (prevents silent crashes)
const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const NODE_ENV = process.env.NODE_ENV;

if (!BETTER_AUTH_SECRET) {
  throw new Error('Missing BETTER_AUTH_SECRET');
}

export const auth = betterAuth({
  secret: BETTER_AUTH_SECRET,

  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: authSchema.authUsers,
      session: authSchema.sessions,
      account: authSchema.accounts,
      verification: authSchema.verifications,
    },
  }),

  trustedOrigins: [
    'http://localhost:5173',
    // 👉 add your production domain here
  ],

  emailAndPassword: {
    enabled: true,
    // async sendResetPassword(url: string, user: { email: string; name?: string }) {
    //   // TODO: Replace with real email service
    //   console.log(`Reset password for ${user.email}: ${url}`);
    // },
  },

  socialProviders: GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
        },
      }
    : {},

  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
  },

  advanced: {
    cookiePrefix: 'lezie',

    cookies: {
      session: {
        attributes: {
          secure: NODE_ENV === 'production', // ✅ only HTTPS in prod
          httpOnly: true,
          sameSite: 'lax',
        },
      },
    },
  },
});


// ✅ SECURE Auth Service (NO FAKE TOKEN TRUST)
export const AuthService = {
  async getSession(request: Request) {
    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      return session;
    } catch (error) {
      console.error('Session verification failed:', error);
      return null;
    }
  },
};