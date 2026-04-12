// src/routes/api/login-resolver/+server.ts
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { authUsers } from '$lib/server/db/auth-schema';
import { eq } from 'drizzle-orm';
import { searchHashFor } from '$lib/security/dataProtection';

// Better Auth stores the encrypted email in the email column.
// We return the encrypted email so authClient.signIn.email() can find
// the user by matching it directly against the DB column.

export const POST = async ({ request }) => {
  const { identifier } = await request.json();

  if (!identifier?.trim()) {
    return json({ error: 'e-Mail, Phone or Username is required' }, { status: 400 });
  }

  const id = identifier.trim();

  try {
    // 1. Try email hash
    const emailHash = await searchHashFor(id.toLowerCase(), 'email');
    const byEmail = await db.query.authUsers.findFirst({
      where: eq(authUsers.emailHash, emailHash)
    });
    if (byEmail?.email) {
      // Return the encrypted email — Better Auth matches against the encrypted column
      return json({ email: byEmail.email });
    }

    // 2. Try username hash
    const usernameHash = await searchHashFor(id.toLowerCase(), 'username');
    const byUsername = await db.query.authUsers.findFirst({
      where: eq(authUsers.usernameHash, usernameHash)
    });
    if (byUsername?.email) {
      return json({ email: byUsername.email });
    }

    // 3. Try phone hash
    const phoneHash = await searchHashFor(id, 'phone');
    const byPhone = await db.query.authUsers.findFirst({
      where: eq(authUsers.phoneHash, phoneHash)
    });
    if (byPhone?.email) {
      return json({ email: byPhone.email });
    }

    return json({ error: 'No account was found' }, { status: 404 });

  } catch (err) {
    console.error('[LOGIN-RESOLVER] Error:', err);
    return json({ error: 'Something went wrong' }, { status: 500 });
  }
};
