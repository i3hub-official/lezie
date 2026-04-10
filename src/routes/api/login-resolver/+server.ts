import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { or, eq } from 'drizzle-orm';

export const POST = async ({ request }) => {
    const { identifier } = await request.json();

    // Find the user by any of the 3 identifiers
    const user = await db.query.users.findFirst({
        where: or(
            eq(users.email, identifier),
            eq(users.username, identifier),
            eq(users.phoneNumber, identifier)
        )
    });

    if (!user) {
        return json({ error: "User not found" }, { status: 404 });
    }

    // Return the primary email so the frontend can call signIn.email
    return json({ email: user.email });
};
