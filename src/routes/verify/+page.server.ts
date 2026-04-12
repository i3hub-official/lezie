// src/routes/verify/+page.server.ts
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { dev } from '$app/environment';

function tokenToCode(token: string): string {
  const positions = [2, 7, 13, 19, 26, 31];
  return positions
    .map(i => token.charCodeAt(i % token.length) % 10)
    .join('');
}

export const load: PageServerLoad = async ({ url, request }) => {
  const token = url.searchParams.get('token');

  if (!token) {
    return { status: 'invalid', code: null, message: 'No verification token provided.' };
  }

  try {
    const response = await auth.handler(
      new Request(
        new URL(`/api/auth/verify-email?token=${encodeURIComponent(token)}`, url.origin),
        { method: 'GET', headers: request.headers }
      )
    );

    // Log the raw response in dev so we know exactly what Better Auth returns
    if (dev) {
      const clone = response.clone();
      const text  = await clone.text().catch(() => '(unreadable)');
      console.log(`[VERIFY] status=${response.status} body=${text.slice(0, 300)}`);
    }

    // Better Auth redirects (302/303) on success, returns 200 with JSON on some configs.
    // It returns 400 for invalid/expired tokens and 500 for server errors.
    if (response.status === 200 || response.status === 302 || response.status === 303) {
      return { status: 'success', code: tokenToCode(token), message: null };
    }

    if (response.status === 400) {
      return {
        status: 'expired',
        code:    null,
        message: 'This link has already been used or has expired.'
      };
    }

    const data = await response.json().catch(() => ({}));
    return {
      status:  'error',
      code:    null,
      message: (data as any)?.message ?? `Verification failed (${response.status}).`
    };

  } catch (err) {
    console.error('[VERIFY]', err);
    return { status: 'error', code: null, message: 'Something went wrong. Please try again.' };
  }
};
