// src/routes/api/resend-verification/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { auth } from '$lib/server/auth';
import { verifyEmailRef } from '$lib/server/email/ref';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { ref } = await request.json();

    // Validate the signed ref — never accept a raw email from the client
    const result = verifyEmailRef(ref);
    if (!result.ok) {
      return json({ error: 'Invalid or expired session. Please sign up again.' }, { status: 400 });
    }

    const response = await auth.handler(
      new Request(
        new URL('/api/auth/send-verification-email', request.url),
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ email: result.email }),
        }
      )
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return json(
        { error: (data as any)?.message ?? 'Failed to resend' },
        { status: response.status }
      );
    }

    return json({ success: true });
  } catch (err) {
    console.error('[RESEND-VERIFICATION]', err);
    return json({ error: 'Failed to resend verification email' }, { status: 500 });
  }
};