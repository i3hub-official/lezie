// src/routes/api/profile/+server.ts

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users, userProfiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { protectName, protectText, protectPhone } from '$lib/security/dataProtection';

export const PATCH: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) throw error(401, 'Unauthorized');

  const userId = locals.user.id;
  const body = await request.json();

  const {
    firstName,
    lastName,
    phone,
    city,
    country,
    address,
    bio,
    twitterHandle,
    linkedinHandle,
  } = body;

  try {
    // Encrypt profile fields
    const profileUpdate: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (firstName !== undefined)
      profileUpdate.firstName = firstName ? protectName(firstName) : null;
    if (lastName !== undefined)
      profileUpdate.lastName = lastName ? protectName(lastName) : null;
    if (city !== undefined)
      profileUpdate.city = city ? protectText(city) : null;
    if (country !== undefined)
      profileUpdate.country = country ? protectText(country) : null;
    if (address !== undefined)
      profileUpdate.address = address ? protectText(address) : null;
    if (bio !== undefined)
      profileUpdate.bio = bio ? protectText(bio) : null;

    await db
      .update(userProfiles)
      .set(profileUpdate)
      .where(eq(userProfiles.userId, userId));

    // Phone lives in users table
    if (phone !== undefined) {
      const { encrypted: encPhone } = await protectPhone(phone);
      await db
        .update(users)
        .set({ phone: encPhone, updatedAt: new Date() })
        .where(eq(users.id, userId));
    }

    // Social links live in userProfiles as jsonb (location field repurposed)
    // Actually store in bio jsonb — we'll use a dedicated approach:
    // Store social links in userProfiles.location as { twitter, linkedin }
    if (twitterHandle !== undefined || linkedinHandle !== undefined) {
      const [existing] = await db
        .select({ location: userProfiles.location })
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId));

      const currentSocial = (existing?.location as any)?.social ?? {};
      const updatedSocial = {
        ...currentSocial,
        ...(twitterHandle !== undefined  ? { twitter:  twitterHandle  } : {}),
        ...(linkedinHandle !== undefined ? { linkedin: linkedinHandle } : {}),
      };

      await db
        .update(userProfiles)
        .set({
          location: {
            ...(existing?.location as any ?? {}),
            social: updatedSocial,
          },
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.userId, userId));
    }

    return json({ success: true });
  } catch (err) {
    console.error('[PROFILE:UPDATE] Failed:', err);
    throw error(500, 'Failed to update profile');
  }
};