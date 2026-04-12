// src/routes/verify/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { authUsers, verifications } from '$lib/server/db/auth-schema';
import { eq, and, gt } from 'drizzle-orm';
import { dev } from '$app/environment';

function tokenToCode(token: string): string {
  const positions = [2, 7, 13, 19, 26, 31];
  return positions
    .map(i => token.charCodeAt(i % token.length) % 10)
    .join('');
}

export const load: PageServerLoad = async ({ url, cookies }) => {
  const token = url.searchParams.get('token');

  if (!token) {
    redirect(303, '/signup');
  }

  try {
    // Better Auth stores verification tokens in the `verification` table.
    // The identifier is the encrypted email, value is the token.
    // We query directly — bypassing Zod email validation entirely.
    const now = new Date();

    const record = await db
      .select()
      .from(verifications)
      .where(
        and(
          eq(verifications.value, token),
          gt(verifications.expiresAt, now)
        )
      )
      .limit(1);

    if (dev) {
      console.log('[VERIFY] record found:', record.length > 0);
      console.log('[VERIFY] token:', token.slice(0, 30) + '...');
    }

    if (record.length === 0) {
      return {
        status:  'error',
        message: 'This link has already been used or has expired.',
      };
    }

    const verification = record[0];

    // Mark the email as verified on the auth user
    await db
      .update(authUsers)
      .set({ emailVerified: true })
      .where(eq(authUsers.email, verification.identifier));

    // Delete the token so it can't be reused
    await db
      .delete(verifications)
      .where(eq(verifications.value, token));

    if (dev) console.log('[VERIFY] ✅ Email verified for identifier:', verification.identifier.slice(0, 20) + '...');

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
