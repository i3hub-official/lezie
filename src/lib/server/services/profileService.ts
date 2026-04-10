// src/lib/server/services/profileService.ts
import { db } from '$lib/server/db';
import { users, userProfiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import * as Prot from '$lib/security/dataProtection';

export async function getProfile(userId: string) {
  const [row] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId));

  if (!row) return null;

  return {
    ...row,
    firstName: row.firstName ? Prot.revealName(row.firstName) : null,
    lastName:  row.lastName  ? Prot.revealName(row.lastName)  : null,
    bio:       row.bio       ? Prot.revealText(row.bio)       : null,
    city:      row.city      ? Prot.revealText(row.city)      : null,
    country:   row.country   ? Prot.revealText(row.country)   : null,
    address:   row.address   ? Prot.revealText(row.address)   : null,
  };
}

export async function setKycData(userId: string, data: object) {
  const encrypted = Prot.protectKycData(data); // no userId param
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
    return Prot.revealKycData<T>(row.kyc as string); // no userId param
  } catch (e) {
    console.error(`[KYC] Decryption failed for ${userId}: possible tampering or key mismatch`);
    return null;
  }
}