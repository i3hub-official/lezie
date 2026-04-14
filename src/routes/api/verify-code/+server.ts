// src/routes/api/verify-code/+server.ts
//
// 1. Validates the 6-digit code against the verifications table
// 2. On success, calls Better Auth's verify-email endpoint to mark
//    the email as verified and set the session cookie
// 3. Proxies the Set-Cookie header back to the browser

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { verifications } from '$lib/server/db/auth-schema';
import { eq, and, gt, like } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request, url }) => {
  try {
    const { code, ref } = await request.json();

    if (!code || !/^\d{6}$/.test(code.trim())) {
      return json({ error: 'Enter a valid 6-digit code.' }, { status: 400 });
    }

    const now = new Date();

    // ── 1. Look up code in verifications table ────────────────────────────
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

    // Extract the token stored alongside the code
    // The identifier is: verify_code:<email>
    // The value is the 6-digit code
    // The token for Better Auth is stored in a separate verifications row
    // Look for the Better Auth token row for this email
    const email = record[0].identifier.replace('verify_code:', '');

    // ── 2. Find the Better Auth verification token for this email ─────────
    const tokenRecord = await db
      .select()
      .from(verifications)
      .where(
        and(
          eq(verifications.identifier, email),
          gt(verifications.expiresAt, now)
        )
      )
      .limit(1);

    // ── 3. Delete the code so it can't be reused ──────────────────────────
    await db
      .delete(verifications)
      .where(eq(verifications.id, record[0].id));

    if (tokenRecord.length === 0) {
      // No Better Auth token found — fall back to just marking success
      // The user will need to use the email link instead
      return json(
        { error: 'Verification token expired. Please request a new verification email.' },
        { status: 400 }
      );
    }

    const betterAuthToken = tokenRecord[0].value;

    // ── 4. Call Better Auth's verify-email endpoint ───────────────────────
    // This marks emailVerified = true and sets the session cookie
    const baseUrl = env.BETTER_AUTH_URL ?? url.origin;

    const verifyRes = await fetch(
      `${baseUrl}/api/auth/verify-email?token=${encodeURIComponent(betterAuthToken)}&callbackURL=/dashboard`,
      {
        method:   'GET',
        redirect: 'manual', // Don't follow the redirect — we handle it
      }
    );

    // ── 5. Proxy Set-Cookie headers back to the browser ───────────────────
    const setCookie = verifyRes.headers.get('set-cookie');

    const headers = new Headers({ 'Content-Type': 'application/json' });
    if (setCookie) {
      headers.set('set-cookie', setCookie);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers }
    );

  } catch (err) {
    console.error('[VERIFY-CODE]', err);
    return json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
};