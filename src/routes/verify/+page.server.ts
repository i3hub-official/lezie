// src/routes/verify/+page.server.ts
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';

// Deterministically derive a short human-readable code from the token.
// The code is generated on the server from the token — it never exists
// independently and is never stored or transmitted separately.
function tokenToCode(token: string): string {
  // Take characters spread across the token and map to digits
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
    // Let Better Auth validate the token and mark the email as verified
    const response = await auth.handler(
      new Request(
        new URL(`/api/auth/verify-email?token=${encodeURIComponent(token)}`, url.origin),
        { method: 'GET', headers: request.headers }
      )
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const message = (data as any)?.message ?? 'Verification failed.';

      // Token already used
      if (response.status === 400) {
        return { status: 'expired', code: null, message: 'This link has already been used or has expired.' };
      }

      return { status: 'error', code: null, message };
    }

    // Token is valid — derive the display code from it
    const code = tokenToCode(token);
    return { status: 'success', code, message: null };

  } catch (err) {
    console.error('[VERIFY]', err);
    return { status: 'error', code: null, message: 'Something went wrong. Please try again.' };
  }
};
