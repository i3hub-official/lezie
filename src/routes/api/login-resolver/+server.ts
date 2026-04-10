import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { authUsers } from '$lib/server/db/auth-schema';
import { eq } from 'drizzle-orm';

export const POST = async ({ request }) => {
  const { identifier } = await request.json();

  if (!identifier?.trim()) {
    return json({ error: 'Identifier is required' }, { status: 400 });
  }

  const id = identifier.trim();

  // 1. Try email (lowercased)
  const byEmail = await db.query.authUsers.findFirst({
    where: eq(authUsers.email, id.toLowerCase())
  });
  if (byEmail) return json({ email: byEmail.email });

  // 2. Try username (case-insensitive)
  const byUsername = await db.query.authUsers.findFirst({
    where: eq(authUsers.username, id.toLowerCase())
  });
  if (byUsername) return json({ email: byUsername.email });

  // 3. Try phone number (as-is, no lowercasing)
  const byPhone = await db.query.authUsers.findFirst({
    where: eq(authUsers.phoneNumber, id)
  });
  if (byPhone) return json({ email: byPhone.email });

  return json({ error: 'Account not found' }, { status: 404 });
};