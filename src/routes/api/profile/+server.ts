// src/routes/api/profile/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { userProfiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import {
  protectText,
  protectName,
  protectNIN,
  protectBVN,
} from '$lib/security/dataProtection';

export const PATCH: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

  const userId = locals.user.id;
  const body   = await request.json();

  // ── Load current profile to enforce immutability rules ──────────────────
  const current = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, userId),
  });

  if (!current) return json({ error: 'Profile not found' }, { status: 404 });

  const updates: Record<string, any> = { updatedAt: new Date() };

  // ── Mutable free-text fields ─────────────────────────────────────────────
  if (body.bio         !== undefined) updates.bio         = body.bio         ? protectText(body.bio)         : null;
  if (body.address     !== undefined) updates.address     = body.address     ? protectText(body.address)     : null;
  if (body.homeAddress !== undefined) updates.homeAddress = body.homeAddress ? protectText(body.homeAddress) : null;
  if (body.city        !== undefined) updates.city        = body.city        ? protectText(body.city)        : null;
  if (body.state       !== undefined) updates.state       = body.state       ? protectText(body.state)       : null;
  if (body.country     !== undefined) updates.country     = body.country     ? protectText(body.country)     : null;
  if (body.location    !== undefined) updates.location    = body.location;
  if (body.socialLinks !== undefined) updates.socialLinks = body.socialLinks;

  // ── Username — set-once lock ─────────────────────────────────────────────
  if (body.username !== undefined) {
    if (current.usernameSetAt) {
      return json({ error: 'Username cannot be changed once set.' }, { status: 400 });
    }
    const trimmed = body.username.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,30}$/.test(trimmed)) {
      return json({ error: 'Username must be 3–30 characters: letters, numbers, underscores only.' }, { status: 400 });
    }
    const taken = await db.query.userProfiles.findFirst({
      where: eq(userProfiles.username, trimmed),
    });
    if (taken && taken.userId !== userId) {
      return json({ error: 'Username is already taken.' }, { status: 409 });
    }
    updates.username      = trimmed;
    updates.usernameSetAt = new Date();
  }

  // ── NIN — store encrypted, mark pending, lock once verified ─────────────
  if (body.nin !== undefined) {
    if (current.ninVerified) {
      return json({ error: 'NIN cannot be changed after verification.' }, { status: 400 });
    }
    const { encrypted } = await protectNIN(body.nin);
    updates.nin            = encrypted;
    updates.ninSubmittedAt = new Date();
  }

  // ── BVN — same pattern ───────────────────────────────────────────────────
  if (body.bvn !== undefined) {
    if (current.bvnVerified) {
      return json({ error: 'BVN cannot be changed after verification.' }, { status: 400 });
    }
    const { encrypted } = await protectBVN(body.bvn);
    updates.bvn            = encrypted;
    updates.bvnSubmittedAt = new Date();
  }

  // ── Fields that are NEVER updatable via this endpoint ───────────────────
  // firstName, lastName, dateOfBirth → set at signup, immutable
  // email, phone → stored in authUsers / users, not in userProfiles
  // avatarUrl, coverUrl → updated only via /api/profile/upload

  await db
    .update(userProfiles)
    .set(updates)
    .where(eq(userProfiles.userId, userId));

  return json({ success: true });
};
