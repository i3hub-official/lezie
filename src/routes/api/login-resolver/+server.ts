import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { authUsers } from '$lib/server/db/auth-schema';
import { or, eq } from 'drizzle-orm';

export const POST = async ({ request }) => {
  const { identifier } = await request.json();

  // Search by email only in authUsers (Better Auth's table)
  const user = await db.query.authUsers.findFirst({
    where: eq(authUsers.email, identifier)
  });

  if (!user) {
    return json({ error: 'Account not found' }, { status: 404 });
  }

  return json({ email: user.email });
};