// src/lib/server/services/profileService.ts
import { db } from '$lib/server/db';
import { users, userProfiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import * as Prot from '$lib/security/dataProtection';

export async function getProfile(userId: string) {
  const [profile] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId));

  const [account] = await db
    .select({ phone: users.phone, email: users.email })
    .from(users)
    .where(eq(users.id, userId));

  if (!profile) return null;

  return {
    ...profile,
    firstName: profile.firstName ? Prot.revealName(profile.firstName) : null,
    lastName:  profile.lastName  ? Prot.revealName(profile.lastName)  : null,
    bio:       profile.bio       ? Prot.revealText(profile.bio)       : null,
    city:      profile.city      ? Prot.revealText(profile.city)      : null,
    country:   profile.country   ? Prot.revealText(profile.country)   : null,
    address:   profile.address   ? Prot.revealText(profile.address)   : null,
    // Decrypt phone from users table and attach to profile
    phone:     account?.phone    ? Prot.revealPhone(account.phone)    : null,
    email:     account?.email    ? Prot.revealEmail(account.email)    : null,
  };
}

export async function setKycData(userId: string, data: object) {
  const encrypted = Prot.protectKycData(data);
  await db
    .update(users)
    .set({ kycData: encrypted, updatedAt: new Date() })
    .where(eq(users.id, userId));
}

export async function getKycData<T = object>(userId: string): Promise<T | null> {
  const [row] = await db
    .select({ kyc: users.kycData })
    .from(users)
    .where(eq(users.id, userId));

  if (!row?.kyc) return null;

  try {
    return Prot.revealKycData<T>(row.kyc as string);
  } catch (e) {
    console.error(`[KYC] Decryption failed for ${userId}: possible tampering or key mismatch`);
    return null;
  }
}