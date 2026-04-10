import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '$lib/server/db';
import * as authSchema from '$lib/server/db/auth-schema';
import { users } from '$lib/server/db/schema';
import { env } from '$env/dynamic/private'; // More reliable for SvelteKit

export const auth = betterAuth({
  // Use env.BETTER_AUTH_SECRET or a fallback for dev
  secret: env.BETTER_AUTH_SECRET || 'dev-secret-key-at-least-32-characters-long-12345',
  
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
  },

  // FIXED: Better Auth v1.x uses databaseHooks for syncing
  q (user) => {
          try {
            await db.insert(users).values({
              id: user.id,
              email: user.email,
              tier: '1',
              trustScore: 0,
              kycStatus: 'pending',
              isActive: true,
            }).onConflictDoNothing();
            console.log('✅ User synced to app users table:', user.id);
          } catch (error) {
            console.error('❌ Failed to sync user:', error);
          }
        },
      },
    },
  },

  trustedOrigins: [
    'http://localhost:5173',
    'http://lezie.vercel.app'
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
  },

  advanced: {
    crossSubDomainCookies: true,
  },
});
