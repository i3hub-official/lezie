// src/routes/verify/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { authUsers, verifications } from '$lib/server/db/auth-schema';
import { eq } from 'drizzle-orm';
import { dev } from '$app/environment';
import { createHmac, timingSafeEqual, createHash } from 'crypto';
import { env } from '$env/dynamic/private';

function tokenToCode(token: string): string {
  const positions = [2, 7, 13, 19, 26, 31];
  return positions
    .map(i => token.charCodeAt(i % token.length) % 10)
    .join('');
}

function verifyJwt(token: string): { email: string; exp: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, sigB64] = parts;
    const expected = createHmac('sha256', env.BETTER_AUTH_SECRET)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64url');
    const sigBuf = Buffer.from(sigB64,   'base64url');
    const expBuf = Buffer.from(expected, 'base64url');
    if (sigBuf.length !== expBuf.length) return null;
    if (!timingSafeEqual(sigBuf, expBuf)) return null;
    return JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
  } catch { return null; }
}

export const load: PageServerLoad = async ({ url, cookies }) => {
  const token = url.searchParams.get('token');
  if (!token) redirect(303, '/signup');

  try {
    const payload = verifyJwt(token);

    if (dev) console.log('[VERIFY] payload:', payload
      ? { email: payload.email?.slice(0, 20) + '...', exp: new Date(payload.exp * 1000) }
      : 'invalid signature'
    );

    if (!payload) {
      return { status: 'error', message: 'Invalid verification link.' };
    }

    if (Date.now() > payload.exp * 1000) {
      return { status: 'error', message: 'This link has expired. Please request a new one.' };
    }

    // Mark email as verified
    const updated = await db
      .update(authUsers)
      .set({ emailVerified: true })
      .where(eq(authUsers.email, payload.email))
      .returning({ id: authUsers.id });

    if (dev) console.log('[VERIFY] rows updated:', updated.length);

    if (updated.length === 0) {
      return { status: 'error', message: 'Account not found or already verified.' };
    }

    const code      = tokenToCode(token);
    const hash      = createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Store code in verifications table so any device/browser can validate it
    await db.insert(verifications).values({
      id:         `vc_${hash.slice(0, 24)}`,
      identifier: `verify_code:${hash}`,
      value:      code,
      expiresAt,
    }).onConflictDoUpdate({
      target: verifications.id,
      set:    { value: code, expiresAt },
    });

    if (dev) console.log('[VERIFY] ✅ code stored:', code, '| expires:', expiresAt);

    return { status: 'success', code };

  } catch (err: any) {
    console.error('[VERIFY] error:', err?.message ?? err);
    return { status: 'error', message: 'Something went wrong. Please try again.' };
  }
};
