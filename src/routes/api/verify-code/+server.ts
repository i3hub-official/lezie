// src/routes/api/verify-code/+server.ts
//
// The user provides their 6-digit code. We look it up in the verifications
// table by value — no tokenHash needed from the client. The code itself
// is the lookup key, scoped by the verify_code: prefix.
// Works from any device/browser.

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { verifications } from '$lib/server/db/auth-schema';
import { eq, and, gt, like } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { code } = await request.json();

    if (!code || !/^\d{6}$/.test(code.trim())) {
      return json({ error: 'Enter a valid 6-digit code.' }, { status: 400 });
    }

    const now = new Date();

    // Look up by the code value itself — scoped to verify_code: identifiers
    const record = await db
      .select()
      .from(verifications)
      .where(
        and(
          like(verifications.identifier, 'verify_code:%'),
          eq(verifications.value, code.trim()),
          gt(verifications.expiresAt, now)
        )
      )
      .limit(1);

    if (record.length === 0) {
      return json(
        { error: 'Incorrect or expired code. Please try again.' },
        { status: 400 }
      );
    }

    // Correct — delete so it can't be reused
    await db
      .delete(verifications)
      .where(eq(verifications.id, record[0].id));

    return json({ success: true });

  } catch (err) {
    console.error('[VERIFY-CODE]', err);
    return json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
};
