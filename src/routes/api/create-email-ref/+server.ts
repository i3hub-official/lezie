// src/routes/api/create-email-ref/+server.ts
//
// Creates a signed email ref token for use in the /verify-email URL.
// Called immediately after signup — before the session cookie has fully
// propagated to the client, so session check is skipped here.
// Security is provided by the HMAC signature in createEmailRef itself.

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createEmailRef } from '$lib/server/email/ref';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return json({ error: 'Valid email is required' }, { status: 400 });
    }

    const ref = createEmailRef(email.trim().toLowerCase());
    return json({ ref });
  } catch (err) {
    console.error('[CREATE-EMAIL-REF]', err);
    return json({ error: 'Failed to create email ref' }, { status: 500 });
  }
};
