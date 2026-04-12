// src/routes/verify-email/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { verifyEmailRef } from '$lib/server/email/ref';

export const load: PageServerLoad = async ({ url, locals }) => {
  // Already verified and authenticated — skip straight to dashboard
  if (locals.session && (locals.user as any)?.emailVerified) {
    redirect(303, '/dashboard');
  }

  const ref    = url.searchParams.get('ref');
  const result = verifyEmailRef(ref);

  if (!result.ok) {
    // No ref, tampered, or expired → back to signup
    // Don't reveal why — just redirect silently
    redirect(303, '/signup');
  }

  // Mask the email for display — never send the raw email to the client
  const { email } = result;
  const [local, domain] = email.split('@');
  const visible     = local.length > 2 ? local.slice(0, 2) : local[0];
  const maskedEmail = `${visible}${'•'.repeat(Math.max(2, local.length - 2))}@${domain}`;

  // Pass the ref (not the email) back to the page — the page uses the ref
  // when calling /api/resend-verification, so the raw email never touches the client
  return { maskedEmail, ref };
};
