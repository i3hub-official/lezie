// src/routes/verify/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { authUsers } from '$lib/server/db/auth-schema';
import { eq } from 'drizzle-orm';
import { dev } from '$app/environment';
import { createHmac, timingSafeEqual } from 'crypto';
import { env } from '$env/dynamic/private';

function tokenToCode(token: string): string {
  const positions = [2, 7, 13, 19, 26, 31];
  return positions
    .map(i => token.charCodeAt(i % token.length) % 10)
    .join('');
}

// Verify a Better Auth JWT (HS256) and return its payload.
// Better Auth signs tokens with BETTER_AUTH_SECRET.
function verifyJwt(token: string): { email: string; exp: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, sigB64] = parts;
    const secret  = env.BETTER_AUTH_SECRET;
    const signing  = `${headerB64}.${payloadB64}`;

    // Verify HMAC-SHA256 signature
    const expected = createHmac('sha256', secret)
      .update(signing)
      .digest('base64url');

    const sigBuf = Buffer.from(sigB64,  'base64url');
    const expBuf = Buffer.from(expected, 'base64url');

    if (sigBuf.length !== expBuf.length) return null;
    if (!timingSafeEqual(sigBuf, expBuf)) return null;

    // Decode payload
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    return payload;
  } catch {
    return null;
  }
}

export const load: PageServerLoad = async ({ url, cookies }) => {
  const token = url.searchParams.get('token');
  if (!token) redirect(303, '/signup');

  try {
    const payload = verifyJwt(token);

    if (dev) {
      console.log('[VERIFY] payload:', payload
        ? { email: payload.email?.slice(0, 20) + '...', exp: new Date(payload.exp * 1000) }
        : 'null — invalid signature'
      );
    }

    if (!payload) {
      return { status: 'error', message: 'Invalid verification link.' };
    }

    if (Date.now() > payload.exp * 1000) {
      return { status: 'error', message: 'This link has expired. Please request a new one.' };
    }

    // payload.email is the encrypted email — match it against the DB directly
    const updated = await db
      .update(authUsers)
      .set({ emailVerified: true })
      .where(eq(authUsers.email, payload.email))
      .returning({ id: authUsers.id });

    if (dev) console.log('[VERIFY] rows updated:', updated.length);

    if (updated.length === 0) {
      return { status: 'error', message: 'Account not found or already verified.' };
    }

    const code = tokenToCode(token);

    cookies.set('_vc', code, {
      path:     '/api/verify-code',
      httpOnly: true,
      sameSite: 'lax',
      secure:   !dev,
      maxAge:   60 * 15,
    });

    return { status: 'success', code };

  } catch (err: any) {
    console.error('[VERIFY] error:', err?.message ?? err);
    return { status: 'error', message: 'Something went wrong. Please try again.' };
  }
};
