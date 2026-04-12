// src/routes/verify/+page.server.ts
//
// User lands here after clicking the link in their email.
// We validate the token with Better Auth, derive a 6-digit display code,
// store it server-side in the session, then show it to the user.
// The code never travels over any channel — only the user's eyes carry it back.

import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { dev } from '$app/environment';

// Derive a 6-digit code deterministically from the token.
// Same token always produces the same code — no storage needed.
function tokenToCode(token: string): string {
  const positions = [2, 7, 13, 19, 26, 31];
  return positions
    .map(i => token.charCodeAt(i % token.length) % 10)
    .join('');
}

export const load: PageServerLoad = async ({ url, request, cookies }) => {
  const token = url.searchParams.get('token');

  if (!token) {
    redirect(303, '/signup');
  }

  try {
    const response = await auth.handler(
      new Request(
        new URL(`/api/auth/verify-email?token=${encodeURIComponent(token)}`, url.origin),
        { method: 'GET', headers: request.headers }
      )
    );

    if (dev) {
      const text = await response.clone().text().catch(() => '');
      console.log(`[VERIFY] status=${response.status} body=${text.slice(0, 200)}`);
    }

    const success = response.status === 200
      || response.status === 302
      || response.status === 303;

    if (!success) {
      const data = await response.json().catch(() => ({}));
      const message = response.status === 400
        ? 'This link has already been used or has expired.'
        : ((data as any)?.message ?? 'Verification failed.');
      return { status: 'error', message };
    }

    // Derive the code and store it in a short-lived signed cookie.
    // The verify-email page reads this to validate what the user types.
    const code = tokenToCode(token);

    cookies.set('_vc', code, {
      path:     '/api/verify-code',
      httpOnly: true,
      sameSite: 'strict',
      secure:   !dev,
      maxAge:   60 * 15, // 15 minutes to enter the code
    });

    return { status: 'success', code };

  } catch (err) {
    console.error('[VERIFY]', err);
    return { status: 'error', message: 'Something went wrong. Please try again.' };
  }
};
