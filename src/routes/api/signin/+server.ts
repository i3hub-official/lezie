// src/routes/api/signin/+server.ts
//
// Custom signin endpoint — resolves identifier to encrypted email,
// then calls Better Auth's signin handler directly so the encrypted
// email never passes through Better Auth's client-side Zod validation.

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { authUsers } from '$lib/server/db/auth-schema';
import { eq } from 'drizzle-orm';
import { searchHashFor } from '$lib/security/dataProtection';
import { auth } from '$lib/server/auth';

async function resolveToEncryptedEmail(identifier: string): Promise<string | null> {
  const id = identifier.trim();

  // Try email
  const emailHash = await searchHashFor(id.toLowerCase(), 'email');
  const byEmail   = await db.query.authUsers.findFirst({ where: eq(authUsers.emailHash, emailHash) });
  if (byEmail) return byEmail.email;

  // Try username
  const usernameHash = await searchHashFor(id.toLowerCase(), 'username');
  const byUsername   = await db.query.authUsers.findFirst({ where: eq(authUsers.usernameHash, usernameHash) });
  if (byUsername) return byUsername.email;

  // Try phone
  const phoneHash = await searchHashFor(id, 'phone');
  const byPhone   = await db.query.authUsers.findFirst({ where: eq(authUsers.phoneHash, phoneHash) });
  if (byPhone) return byPhone.email;

  return null;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { identifier, password, dontRememberMe } = await request.json();

    if (!identifier?.trim() || !password) {
      return json({ error: 'Identifier and password are required' }, { status: 400 });
    }

    const encryptedEmail = await resolveToEncryptedEmail(identifier);

    if (!encryptedEmail) {
      return json({ error: 'Account not found' }, { status: 404 });
    }

    // Forward to Better Auth's signin handler with the encrypted email.
    // We construct the request manually so it bypasses the authClient's
    // Zod email format check — the handler itself only needs the value
    // to match what's in the DB, which it will.
    const baResponse = await auth.handler(
      new Request(new URL('/api/auth/sign-in/email', request.url), {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'cookie': request.headers.get('cookie') ?? '' },
        body:    JSON.stringify({
          email:          encryptedEmail,
          password,
          dontRememberMe: dontRememberMe ?? false,
        }),
      })
    );

    // Forward the response headers (especially Set-Cookie) back to the client
    const data = await baResponse.json().catch(() => ({}));
    const res  = json(data, { status: baResponse.status });

    // Copy all Set-Cookie headers from Better Auth's response
    baResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        res.headers.append('set-cookie', value);
      }
    });

    return res;

  } catch (err: any) {
    console.error('[SIGNIN]', err?.message ?? err);
    return json({ error: 'Something went wrong' }, { status: 500 });
  }
};
