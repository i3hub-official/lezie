// src/routes/api/verify-code/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { verifications } from '$lib/server/db/auth-schema';
import { gt } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request, url }) => {
  try {
    const { code } = await request.json();

    // 1. Validation
    if (!code || !/^[A-Z0-9]{6}$/i.test(code.trim())) {
      return json({ error: 'Enter a valid 6-character code.' }, { status: 400 });
    }

    const upperCode = code.trim().toUpperCase();
    const now = new Date();

    // 2. Fetch active tokens
    const records = await db
      .select()
      .from(verifications)
      .where(gt(verifications.expiresAt, now));

    // 3. Find match logic (ensure this matches your email template derivation exactly)
    const match = records.find(r => {
      const alphanumeric = r.value.replace(/[^a-zA-Z0-9]/g, '');
      const derived = alphanumeric.slice(-6).toUpperCase();
      return derived === upperCode;
    });

    if (!match) {
      return json(
        { error: 'Incorrect or expired code. Please try again.' },
        { status: 400 }
      );
    }

   // 4. Verification Proxy
// Use the current request's origin (IP or Domain) so the fetch 
// stays on the same "network" the browser is using.
const currentOrigin = url.origin; 

// Construct the URL to hit the Better Auth internal endpoint
const verifyUrl = new URL('/api/auth/verify-email', currentOrigin);
verifyUrl.searchParams.set('token', match.value);

// Optional: If you want Better Auth to handle the final redirect internally
// verifyUrl.searchParams.set('callbackURL', '/dashboard');

const verifyRes = await fetch(verifyUrl.toString(), {
  method: 'GET',
  headers: {
    // CRITICAL: Forward the Host header so Better Auth knows which 
    // domain/IP is being used for the session cookie domain
    'host': url.host,
    'User-Agent': request.headers.get('user-agent') ?? '',
  },
  redirect: 'manual', 
});

    // 5. THE FIX: Correctly proxy MULTIPLE Set-Cookie headers
    const responseHeaders = new Headers({ 'Content-Type': 'application/json' });
    
    // verifyRes.headers.getSetCookie() is the modern way to get all individual cookies
    const cookies = verifyRes.headers.getSetCookie();
    
    if (cookies.length > 0) {
      cookies.forEach(cookie => {
        responseHeaders.append('set-cookie', cookie);
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email verified successfully.' 
      }),
      { status: 200, headers: responseHeaders }
    );

  } catch (err) {
    console.error('[VERIFY-CODE] Critical Error:', err);
    return json({ error: 'Server error during verification.' }, { status: 500 });
  }
};