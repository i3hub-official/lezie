// src/lib/server/email/sender.ts
//
// Single place to swap email providers.
// Import sendEmail anywhere on the server — never call a provider SDK directly.

import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

export interface EmailPayload {
  to:      string;
  subject: string;
  html:    string;
}

export async function sendEmail({ to, subject, html }: EmailPayload): Promise<void> {
  if (dev) {
    // Development: log to console, no real emails sent
    console.log('─'.repeat(60));
    console.log(`[EMAIL] 📧  To:      ${to}`);
    console.log(`[EMAIL] 📧  Subject: ${subject}`);
    console.log(`[EMAIL] 📧  Preview: ${html.replace(/<[^>]+>/g, '').trim().slice(0, 120)}…`);
    console.log('─'.repeat(60));
    return;
  }

  // ── Resend (default) ───────────────────────────────────────────────────────
  // pnpm add resend
  // Env: RESEND_API_KEY, EMAIL_FROM
  const { Resend } = await import('resend');
  const resend = new Resend(env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM ?? 'Lezie <no-reply@lezie.app>',
    to,
    subject,
    html,
  });
  if (error) throw new Error(`[EMAIL] Delivery failed: ${error.message}`);

  // ── Nodemailer / SMTP (alternative) ───────────────────────────────────────
  // pnpm add nodemailer
  // Env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM
  //
  // const nodemailer = await import('nodemailer');
  // const t = nodemailer.createTransport({
  //   host: env.SMTP_HOST, port: Number(env.SMTP_PORT ?? 587),
  //   auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  // });
  // await t.sendMail({ from: env.EMAIL_FROM, to, subject, html });
}
