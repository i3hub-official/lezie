// src/routes/api/verify-code/+server.ts
//
// Validates the 6-digit code the user typed against the value
// stored in the httpOnly cookie set by /verify/+page.server.ts.
// The cookie is scoped to this path so it's not readable anywhere else.

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const { code } = await request.json();

  if (!code || typeof code !== 'string' || !/^\d{6}$/.test(code)) {
    return json({ error: 'Enter a valid 6-digit code.' }, { status: 400 });
  }

  const stored = cookies.get('_vc');

  if (!stored) {
    return json(
      { error: 'Code expired or not found. Please click the verification link again.' },
      { status: 400 }
    );
  }

  if (code.trim() !== stored.trim()) {
    return json({ error: 'Incorrect code. Please check and try again.' }, { status: 400 });
  }

  // Correct — clear the cookie so it can't be reused
  cookies.delete('_vc', { path: '/api/verify-code' });

  return json({ success: true });
};
