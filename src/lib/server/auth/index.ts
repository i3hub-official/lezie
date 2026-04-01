import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '$lib/server/db';
import * as authSchema from '$lib/server/db/auth-schema';

export const auth = betterAuth({
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
    async sendResetPassword(url) {
      // Send reset password email
      console.log(`Reset password URL: ${url}`);
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  rateLimit: {
    enabled: true,
    window: 60, // seconds
    max: 100,
  },
  advanced: {
    cookiePrefix: 'lezie',
    generateId: () => crypto.randomUUID(),
  },
});

// Helper function to verify tokens (simplified)
export const AuthService = {
  verifyToken: (token: string) => {
    // This is a simplified version - in production, you'd verify the JWT
    // For now, we'll just return a mock user
    if (!token) return null;
    try {
      // In a real implementation, you'd verify the token with better-auth
      return { id: token };
    } catch {
      return null;
    }
  }
};