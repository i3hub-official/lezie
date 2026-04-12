// src/routes/verify/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
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
    // Use the internal API directly — bypasses Zod email validation
    // which chokes on the encrypted email stored in the JWT payload.
    await auth.api.verifyEmail({
      query: { token },
    });

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
    console.error('[VERIFY]', err);

    const message =
      err?.body?.message === 'Token has expired' || err?.status === 400
        ? 'This link has already been used or has expired.'
        : 'Something went wrong. Please try again.';

    return { status: 'error', message };
  }
};
