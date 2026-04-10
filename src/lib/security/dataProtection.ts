import {
  encryptSearchable,
  decryptSearchable,
  encryptField,
  decryptField,
  encryptSecure,
  decryptSecure,
  generateSearchHash,
  type SearchableField,
} from '$lib/security/encryption';

// ─────────────────────────────────────────────────────────────────────────────
// NORMALIZATION
// ─────────────────────────────────────────────────────────────────────────────
const normalize = {
  email: (s: string): string =>
    s.trim().toLowerCase().replace(/\s+/g, ''),

  phone: (s: string): string => {
    const digits = s.replace(/[^0-9+]/g, '');
    if (digits.startsWith('234')  && digits.length === 13) return digits;
    if (digits.startsWith('0')    && digits.length === 11) return '234' + digits.slice(1);
    if (digits.startsWith('+234') && digits.length === 14) return digits.slice(1);
    return digits;
  },

  username: (s: string): string =>
    s.trim().toLowerCase().replace(/\s+/g, ''),

  name: (s: string): string =>
    s.trim().replace(/\s+/g, ' ').replace(/\w\S*/g, w =>
      w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    ),

  nin: (s: string): string => s.replace(/\D/g, '').trim(),

  bvn: (s: string): string => s.replace(/\D/g, '').trim(),

  governmentId: (s: string): string => s.trim().toUpperCase().replace(/\s+/g, ''),

  accountNumber: (s: string): string => s.replace(/\D/g, '').trim(),

  dateOfBirth: (s: string): string => s.trim(),

  general: (s: string): string => s.trim(),
};

// ─────────────────────────────────────────────────────────────────────────────
// PROTECT — Encrypt on write
// ─────────────────────────────────────────────────────────────────────────────

/** * Tier 1: Deterministic + Search Hash 
 * Use for fields that require database lookups (WHERE clauses).
 */
async function protectTier1(raw: string, field: SearchableField, normalizer: (s: string) => string) {
  const normal = normalizer(raw);
  if (!normal) throw new Error(`Value for ${field} cannot be empty after normalization`);
  return {
    encrypted:  encryptSearchable(normal, field),
    searchHash: generateSearchHash(normal, field),
  };
}

export const protectEmail    = (raw: string) => protectTier1(raw, 'email',    normalize.email);
export const protectPhone    = (raw: string) => protectTier1(raw, 'phone',    normalize.phone);
export const protectUsername = (raw: string) => protectTier1(raw, 'username', normalize.username);
export const protectNin      = (raw: string) => protectTier1(raw, 'nin',      normalize.nin);
export const protectBvn      = (raw: string) => protectTier1(raw, 'bvn',      normalize.bvn);

/** * Tier 2: Random IV (Not searchable) 
 * Use for PII that is displayed but never used as a search key.
 */
export const protectName          = (raw: string) => encryptField(normalize.name(raw));
export const protectText          = (raw: string) => encryptField(normalize.general(raw));
export const protectGovernmentId  = (raw: string) => encryptField(normalize.governmentId(raw));
export const protectAccountNumber = (raw: string) => encryptField(normalize.accountNumber(raw));
export const protectDateOfBirth   = (raw: string) => encryptField(normalize.dateOfBirth(raw));
export const protectGeneral       = (raw: string) => encryptField(normalize.general(raw));

/** * Tier 3: Authenticated GCM with Context Binding
 * The 'ownerId' (e.g., User UUID) is used as AAD (Additional Authenticated Data).
 * This prevents an attacker from moving this blob to another user's database record.
 */
export function protectSensitiveData(raw: object, ownerId: string): string {
  if (!ownerId) throw new Error("Context Binding (ownerId) is required for Tier 3 encryption");
  return encryptSecure(JSON.stringify(raw), ownerId);
}

export function protectKycData(raw: object, ownerId: string): string {
  return protectSensitiveData(raw, ownerId);
}

// ─────────────────────────────────────────────────────────────────────────────
// UNPROTECT — Decrypt on read
// ─────────────────────────────────────────────────────────────────────────────

export const revealEmail    = (enc: string) => decryptSearchable(enc, 'email');
export const revealPhone    = (enc: string) => decryptSearchable(enc, 'phone');
export const revealUsername = (enc: string) => decryptSearchable(enc, 'username');
export const revealNin      = (enc: string) => decryptSearchable(enc, 'nin');
export const revealBvn      = (enc: string) => decryptSearchable(enc, 'bvn');

export const revealName          = (enc: string) => decryptField(enc);
export const revealText          = (enc: string) => decryptField(enc);
export const revealGovernmentId  = (enc: string) => decryptField(enc);
export const revealAccountNumber = (enc: string) => decryptField(enc);
export const revealDateOfBirth   = (enc: string) => decryptField(enc);
export const revealGeneral       = (enc: string) => decryptField(enc);

/** * Decrypts Tier 3 data. Will throw if:
 * 1. The data was tampered with.
 * 2. The ownerId does not match the ID used during encryption.
 */
export function revealSensitiveData<T = any>(enc: string, ownerId: string): T {
  if (!ownerId) throw new Error("Context Binding (ownerId) is required for Tier 3 decryption");
  const decrypted = decryptSecure(enc, ownerId);
  return JSON.parse(decrypted) as T;
}

export function revealKycData<T = any>(enc: string, ownerId: string): T {
  return revealSensitiveData<T>(enc, ownerId);
}

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH HASH LOOKUP — For queries
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a search hash for querying the database.
 * Use this in your login resolver or search functions.
 */
export function searchHashFor(input: string, field: SearchableField): string {
  const normalizers: Record<SearchableField, (s: string) => string> = {
    email:    normalize.email,
    phone:    normalize.phone,
    username: normalize.username,
    nin:      normalize.nin,
    bvn:      normalize.bvn,
  };
  
  const normal = normalizers[field](input);
  return generateSearchHash(normal, field);
}
