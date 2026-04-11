// src/lib/server/email/sender.ts
//
// Single place to swap email providers.
// Import sendEmail anywhere on the server — never call a provider SDK directly.

import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import nodemailer from 'nodemailer';

export interface EmailPayload {
  to:      string;
  subject: string;
  html:    string;
}

// Transporter is created once and reused across requests
const transporter = nodemailer.createTransport({
  host:   env.SMTP_HOST,
  port:   Number(env.SMTP_PORT ?? 587),
  secure: Number(env.SMTP_PORT) === 465, // true for port 465 (SSL), false for 587 (STARTTLS)
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export async function sendEmail({ to, subject, html }: EmailPayload): Promise<void> {
  if (dev) {
    console.log('─'.repeat(60));
    console.log(`[EMAIL] 📧  To:      ${to}`);
    console.log(`[EMAIL] 📧  Subject: ${subject}`);
    console.log(`[EMAIL] 📧  Preview: ${html.replace(/<[^>]+>/g, '').trim().slice(0, 120)}…`);
    console.log('─'.repeat(60));
    return;
  }

  await transporter.sendMail({
    from:    env.EMAIL_FROM ?? `Lezie <no-reply@lezie.app>`,
    to,
    subject,
    html,
  });
}