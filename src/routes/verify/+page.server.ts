// src/routes/verify/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { dev } from '$app/environment';

function tokenToCode(token: string): string {
  const positions = [2, 7, 13, 19, 26, 31];
  return positions
    .map(i => token.charCodeAt(i % token.length) % 10)
    .join('');
}

export const load: PageServerLoad = async ({ url, request, cookies }) => {
  const token = url.searchParams.get('token');

  if (!token) {
    redirect(303, '/signup');
  }

  try {
    const response = await auth.handler(
      new Request(
        new URL(`/api/auth/verify-email?token=${encodeURIComponent(token)}`, url.origin),
        { method: 'GET', headers: request.headers }
      )
    );

    // Always log so we can see exactly what Better Auth returns
    const bodyText = await response.clone().text().catch(() => '');
    console.log(`[VERIFY] status=${response.status}`);
    console.log(`[VERIFY] body=${bodyText.slice(0, 400)}`);
    console.log(`[VERIFY] location=${response.headers.get('location') ?? 'none'}`);

    // Better Auth can return:
    //   200 — success with JSON body
    //   302/303 — redirect on success (callbackURL)
    //   400 — invalid/expired token
    //   500 — server error
    // Treat anything that isn't 4xx/5xx as success
    const failed = response.status >= 400;

    if (failed) {
      let message = 'This link has already been used or has expired.';
      try {
        const data = JSON.parse(bodyText);
        if (data?.message) message = data.message;
      } catch { /* use default */ }
      return { status: 'error', message };
    }

    const code = tokenToCode(token);

    cookies.set('_vc', code, {
      path:     '/api/verify-code',
      httpOnly: true,
      sameSite: 'lax',   // changed from strict — strict blocks cross-tab cookie reads
      secure:   !dev,
      maxAge:   60 * 15,
    });

    return { status: 'success', code };

  } catch (err) {
    console.error('[VERIFY]', err);
    return { status: 'error', message: 'Something went wrong. Please try again.' };
  }
};
