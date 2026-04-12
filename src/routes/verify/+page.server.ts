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

export const load: PageServerLoad = async ({ url, cookies }) => {
  const token = url.searchParams.get('token');

  if (!token) {
    redirect(303, '/signup');
  }

  try {
    // Log the full error so we know exactly what's failing
    const result = await auth.api.verifyEmail({
      query: { token },
    });

    console.log('[VERIFY] api result:', JSON.stringify(result));

    const code = tokenToCode(token);

    cookies.set('_vc', code, {
      path:     '/api/verify-code',
      httpOnly: true,
      sameSite: 'lax',
      secure:   !dev,
      maxAge:   60 * 15,
    });

    return { status: 'success', code };

  } catch (err: any) {
    // Log everything about the error
    console.error('[VERIFY] error name:',    err?.name);
    console.error('[VERIFY] error message:', err?.message);
    console.error('[VERIFY] error status:',  err?.status);
    console.error('[VERIFY] error body:',    JSON.stringify(err?.body));
    console.error('[VERIFY] error cause:',   JSON.stringify(err?.cause));
    console.error('[VERIFY] full error:',    err);

    const isExpired =
      err?.status === 400 ||
      err?.body?.message?.toLowerCase().includes('expir') ||
      err?.body?.message?.toLowerCase().includes('invalid') ||
      err?.message?.toLowerCase().includes('expir');

    return {
      status:  'error',
      message: isExpired
        ? 'This link has already been used or has expired.'
        : 'Something went wrong. Please try again.',
    };
  }
};
