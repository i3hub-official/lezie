// src/routes/verify-email/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { verifyEmailRef } from '$lib/server/email/ref';

export const load: PageServerLoad = async ({ url, locals }) => {
  // Already verified — skip to dashboard
  if (locals.session && (locals.user as any)?.emailVerified) {
    redirect(303, '/dashboard');
  }

  const ref    = url.searchParams.get('ref');
  const result = verifyEmailRef(ref);

  if (!result.ok) {
    redirect(303, '/signup');
  }

  const { email } = result;
  const [local, domain] = email.split('@');
  const visible     = local.length > 2 ? local.slice(0, 2) : local[0];
  const maskedEmail = `${visible}${'•'.repeat(Math.max(2, local.length - 2))}@${domain}`;

  return { maskedEmail, ref };
};
