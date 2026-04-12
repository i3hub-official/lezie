// src/routes/api/resend-verification/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { auth } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return json({ error: 'Email is required' }, { status: 400 });
    }

    await auth.api.sendVerificationEmail({
      body: { email: email.trim().toLowerCase() },
    });

    return json({ success: true });
  } catch (err) {
    console.error('[RESEND-VERIFICATION]', err);
    return json({ error: 'Failed to resend verification email' }, { status: 500 });
  }
};
