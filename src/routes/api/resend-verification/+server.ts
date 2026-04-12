// src/routes/api/resend-verification/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { auth } from '$lib/server/auth';
import { sendEmail } from '$lib/server/email/sender';
import { verificationEmailTemplate } from '$lib/server/email/templates';
import { db } from '$lib/server/db';
import { authUsers } from '$lib/server/db/auth-schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return json({ error: 'Email is required' }, { status: 400 });
    }

    const normalised = email.trim().toLowerCase();

    // Look up the user by email hash to get their Better Auth user record.
    // We call Better Auth's handler directly — this triggers the same
    // sendVerificationEmail flow wired in auth.ts, including token generation.
    const response = await auth.handler(
      new Request(
        new URL('/api/auth/send-verification-email', request.url),
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ email: normalised }),
        }
      )
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const message = (data as any)?.message ?? 'Failed to resend';
      console.error('[RESEND-VERIFICATION]', message);
      return json({ error: message }, { status: response.status });
    }

    return json({ success: true });
  } catch (err) {
    console.error('[RESEND-VERIFICATION]', err);
    return json({ error: 'Failed to resend verification email' }, { status: 500 });
  }
};
