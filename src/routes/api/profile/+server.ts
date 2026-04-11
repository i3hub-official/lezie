// src/routes/api/profile/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users, userProfiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import {
  protectName,
  protectText,
  protectPhone,
} from '$lib/security/dataProtection';

export const PATCH: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) throw error(401, 'Unauthorized');

  const userId = locals.user.id;
  const body   = await request.json();

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
    const profileUpdate: Record<string, any> = {
      updatedAt: new Date(),
    };

    // Only update fields that are non-empty strings
    if (firstName?.trim()) profileUpdate.firstName = protectName(firstName.trim());
    if (lastName?.trim())  profileUpdate.lastName  = protectName(lastName.trim());
    if (city?.trim())      profileUpdate.city      = protectText(city.trim());
    if (country?.trim())   profileUpdate.country   = protectText(country.trim());
    if (address?.trim())   profileUpdate.address   = protectText(address.trim());
    if (bio?.trim())       profileUpdate.bio       = protectText(bio.trim());

    // Social links — store in location jsonb under a 'social' key
    // Only update if at least one handle is provided
    if (twitterHandle?.trim() || linkedinHandle?.trim()) {
      const [existing] = await db
        .select({ location: userProfiles.location })
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId));

      const currentLocation = (existing?.location as any) ?? {};
      const currentSocial   = currentLocation.social ?? {};

      const updatedSocial: Record<string, string> = { ...currentSocial };
      if (twitterHandle?.trim())  updatedSocial.twitter  = twitterHandle.trim();
      if (linkedinHandle?.trim()) updatedSocial.linkedin = linkedinHandle.trim();

      profileUpdate.location = {
        ...currentLocation,
        social: updatedSocial,
      };
    }

    // Only run profile update if there's something to update
    if (Object.keys(profileUpdate).length > 1) {
      await db
        .update(userProfiles)
        .set(profileUpdate)
        .where(eq(userProfiles.userId, userId));
    }

    // Phone — required, must not be empty
    if (phone?.trim()) {
      const { encrypted: encPhone } = await protectPhone(phone.trim());
      await db
        .update(users)
        .set({ phone: encPhone, updatedAt: new Date() })
        .where(eq(users.id, userId));
    }

    return json({ success: true });
  } catch (err) {
    console.error('[PROFILE:UPDATE] Failed:', err);
    throw error(500, 'Failed to update profile');
  }
};