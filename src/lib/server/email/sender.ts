// src/lib/server/email/sender.ts
//
// Single place to swap email providers.
// Import sendEmail anywhere on the server — never call a provider SDK directly.

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
  console.log(`[EMAIL] 📧 Sending to: ${to} | Subject: ${subject}`);

  const info = await transporter.sendMail({
    from:    env.EMAIL_FROM ?? 'Lezie <no-reply@lezie.app>',
    to,
    subject,
    html,
  });

  console.log(`[EMAIL] ✅ Delivered — messageId: ${info.messageId}`);
}
