// src/routes/api/login-resolver/+server.ts
//
// Resolves any identifier (email, username, phone) to the user's plaintext
// email stored in authUsers — which Better Auth can use directly for signin.

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { authUsers } from '$lib/server/db/auth-schema';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { searchHashFor } from '$lib/security/dataProtection';

export const POST: RequestHandler = async ({ request }) => {
  const { identifier } = await request.json();

  if (!identifier?.trim()) {
    return json({ error: 'Identifier is required' }, { status: 400 });
  }

  const id = identifier.trim();

  try {
    // 1. Try direct email match on authUsers (plaintext)
    const byEmail = await db.query.authUsers.findFirst({
      where: eq(authUsers.email, id.toLowerCase()),
    });
    if (byEmail) {
      return json({ email: byEmail.email });
    }

    // 2. Try username — look up hash in your users table, get authUser id, get email
    const usernameHash = await searchHashFor(id.toLowerCase(), 'username');
    const byUsername = await db.query.users.findFirst({
      where: eq(users.usernameHash, usernameHash),
    });
    if (byUsername) {
      const authUser = await db.query.authUsers.findFirst({
        where: eq(authUsers.id, byUsername.id as any),
      });
      if (authUser) return json({ email: authUser.email });
    }

    // 3. Try phone — same pattern
    const phoneHash = await searchHashFor(id, 'phone');
    const byPhone = await db.query.users.findFirst({
      where: eq(users.phoneHash, phoneHash),
    });
    if (byPhone) {
      const authUser = await db.query.authUsers.findFirst({
        where: eq(authUsers.id, byPhone.id as any),
      });
      if (authUser) return json({ email: authUser.email });
    }

    return json({ error: 'Account not found' }, { status: 404 });

  } catch (err) {
    console.error('[LOGIN-RESOLVER]', err);
    return json({ error: 'Something went wrong' }, { status: 500 });
  }
};
