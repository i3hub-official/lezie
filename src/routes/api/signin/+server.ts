// src/routes/api/signin/+server.ts
//
// Fully custom signin — verifies password ourselves using scrypt,
// then creates a Better Auth session directly.
// Needed because Better Auth's signIn.email runs Zod email validation
// which rejects our encrypted email values.

import { json }       from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db }         from '$lib/server/db';
import { authUsers }  from '$lib/server/db/auth-schema';
import { accounts }   from '$lib/server/db/auth-schema';
import { eq, and }    from 'drizzle-orm';
import { searchHashFor } from '$lib/security/dataProtection';
import { auth }       from '$lib/server/auth';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify }  from 'util';

const scryptAsync = promisify(scrypt);

// Better Auth stores passwords as "salt:hash" using scrypt
async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  try {
    // Better Auth format: N:r:p:salt:hash  (all hex/base64)
    // Actual format used by better-auth: check the accounts table password column
    const parts = stored.split(':');

    if (parts.length === 2) {
      // Simple salt:hash format
      const [salt, hash] = parts;
      const saltBuf   = Buffer.from(salt, 'hex');
      const hashBuf   = Buffer.from(hash, 'hex');
      const derived   = await scryptAsync(plain, saltBuf, hashBuf.length) as Buffer;
      return timingSafeEqual(derived, hashBuf);
    }

    // Better Auth uses @node-rs/bcrypt or its own scrypt — try bcrypt format
    // If the hash starts with $2b$, it's bcrypt
    if (stored.startsWith('$2')) {
      const bcrypt = await import('bcryptjs').catch(() => null);
      if (bcrypt) return bcrypt.compare(plain, stored);
    }

    return false;
  } catch {
    return false;
  }
}

async function resolveUser(identifier: string) {
  const id = identifier.trim();

  const emailHash = await searchHashFor(id.toLowerCase(), 'email');
  const byEmail   = await db.query.authUsers.findFirst({ where: eq(authUsers.emailHash, emailHash) });
  if (byEmail) return byEmail;

  const usernameHash = await searchHashFor(id.toLowerCase(), 'username');
  const byUsername   = await db.query.authUsers.findFirst({ where: eq(authUsers.usernameHash, usernameHash) });
  if (byUsername) return byUsername;

  const phoneHash = await searchHashFor(id, 'phone');
  const byPhone   = await db.query.authUsers.findFirst({ where: eq(authUsers.phoneHash, phoneHash) });
  if (byPhone) return byPhone;

  return null;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { identifier, password, dontRememberMe } = await request.json();

    if (!identifier?.trim() || !password) {
      return json({ error: 'Identifier and password are required' }, { status: 400 });
    }

    const user = await resolveUser(identifier);
    if (!user) {
      return json({ error: 'Account not found.' }, { status: 404 });
    }

    // Get the password from the accounts table (Better Auth stores it there)
    const account = await db.query.accounts.findFirst({
      where: and(
        eq(accounts.userId,     user.id),
        eq(accounts.providerId, 'credential')
      )
    });

    if (!account?.password) {
      return json({ error: 'No password set for this account.' }, { status: 400 });
    }

    const valid = await verifyPassword(password, account.password);
    if (!valid) {
      return json({ error: 'Invalid password.' }, { status: 401 });
    }

    // Password is correct — create a session via Better Auth's internal API
    const sessionResult = await auth.api.signInEmail({
      body: {
        email:          user.email,  // encrypted email — passed internally, no Zod here
        password,
        dontRememberMe: dontRememberMe ?? false,
      },
      asResponse: true,
    });

    if (!sessionResult) {
      return json({ error: 'Failed to create session.' }, { status: 500 });
    }

    // Forward the full response including Set-Cookie
    const body    = await (sessionResult as Response).json().catch(() => ({}));
    const res     = json(body, { status: (sessionResult as Response).status });
    (sessionResult as Response).headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') res.headers.append('set-cookie', value);
    });
    return res;

  } catch (err: any) {
    console.error('[SIGNIN]', err?.message ?? err);
    return json({ error: 'Something went wrong.' }, { status: 500 });
  }
};
