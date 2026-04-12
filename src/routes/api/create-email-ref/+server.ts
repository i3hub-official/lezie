// src/routes/api/create-email-ref/+server.ts
//
// Creates a signed email ref token for the client to use in the
// /verify-email URL. The raw email never appears in the URL.

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createEmailRef } from '$lib/server/email/ref';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return json({ error: 'Email is required' }, { status: 400 });
    }

    // Only issue a ref if the requester has an active session
    // (they just signed up — Better Auth sets autoSignIn: true)
    if (!locals.session) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ref = createEmailRef(email.trim().toLowerCase());
    return json({ ref });
  } catch (err) {
    console.error('[CREATE-EMAIL-REF]', err);
    return json({ error: 'Failed to create email ref' }, { status: 500 });
  }
};
