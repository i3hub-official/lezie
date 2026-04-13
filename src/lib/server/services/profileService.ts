// src/lib/server/services/profileService.ts
import { db } from '$lib/server/db';
import { users, userProfiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import * as Prot from '$lib/security/dataProtection';

// Safely decrypt a Tier-2 random-IV field (format: "ivHex:encryptedHex").
// If the value doesn't look encrypted (no colon separator) it's plaintext
// from before encryption was enforced — return as-is.
function safeRevealField(value: string | null | undefined, revealFn: (s: string) => string): string | null {
  if (!value) return null;
  try {
    // Encrypted values always contain a colon separator between IV and ciphertext
    if (!value.includes(':')) return value; // plaintext — return as-is
    return revealFn(value);
  } catch {
    // Decryption failed for any reason — return null rather than crashing
    return null;
  }
}

// Safely decrypt a Tier-1 searchable field (pure hex, no colon).
// If it doesn't look like hex it's plaintext — return as-is.
function safeRevealSearchable(value: string | null | undefined, revealFn: (s: string) => string): string | null {
  if (!value) return null;
  try {
    if (!/^[0-9a-fA-F]+$/.test(value)) return value; // plaintext — return as-is
    return revealFn(value);
  } catch {
    return null;
  }
}

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
    firstName: safeRevealField(profile.firstName, Prot.revealName),
    lastName:  safeRevealField(profile.lastName,  Prot.revealName),
    bio:       safeRevealField(profile.bio,        Prot.revealText),
    city:      safeRevealField(profile.city,       Prot.revealText),
    country:   safeRevealField(profile.country,    Prot.revealText),
    address:   safeRevealField(profile.address,    Prot.revealText),
    phone:     safeRevealSearchable(account?.phone, Prot.revealPhone),
    email:     safeRevealSearchable(account?.email, Prot.revealEmail),
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
  } catch {
    console.error(`[KYC] Decryption failed for ${userId}: possible tampering or key mismatch`);
    return null;
  }
}
