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
// NORMALIZATION — The source of truth for "Clean" data
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

/** Helper for Tier 1 searchable fields with companion hashes */
function protectTier1(raw: string, field: SearchableField, normalizer: (s: string) => string) {
  const normal = normalizer(raw);
  return {
    encrypted:  encryptSearchable(normal, field),
    searchHash: generateSearchHash(normal, field), // Now synchronous
  };
}

export const protectEmail    = (raw: string) => protectTier1(raw, 'email',    normalize.email);
export const protectPhone    = (raw: string) => protectTier1(raw, 'phone',    normalize.phone);
export const protectUsername = (raw: string) => protectTier1(raw, 'username', normalize.username);
export const protectNin      = (raw: string) => protectTier1(raw, 'nin',      normalize.nin);
export const protectBvn      = (raw: string) => protectTier1(raw, 'bvn',      normalize.bvn);

/** Tier 2: Random IV (Not searchable) */
export const protectName           = (raw: string) => encryptField(normalize.name(raw));
export const protectText           = (raw: string) => encryptField(raw.trim());
export const protectGovernmentId   = (raw: string) => encryptField(normalize.governmentId(raw));
export const protectAccountNumber  = (raw: string) => encryptField(normalize.accountNumber(raw));
export const protectDateOfBirth    = (raw: string) => encryptField(normalize.dateOfBirth(raw));
export const protectGeneral        = (raw: string) => encryptField(normalize.general(raw));

/** Tier 3: GCM Authenticated (Tamper-evident blobs) */
export const protectSensitiveData = (raw: object) => encryptSecure(JSON.stringify(raw));
export const protectKycData       = (raw: object) => encryptSecure(JSON.stringify(raw));

// ─────────────────────────────────────────────────────────────────────────────
// UNPROTECT — Decrypt on read
// ─────────────────────────────────────────────────────────────────────────────

export const revealEmail    = (enc: string) => decryptSearchable(enc, 'email');
export const revealPhone    = (enc: string) => decryptSearchable(enc, 'phone');
export const revealUsername = (enc: string) => decryptSearchable(enc, 'username');
export const revealNin      = (enc: string) => decryptSearchable(enc, 'nin');
export const revealBvn      = (enc: string) => decryptSearchable(enc, 'bvn');

export const revealName           = (enc: string) => decryptField(enc);
export const revealText           = (enc: string) => decryptField(enc);
export const revealGovernmentId   = (enc: string) => decryptField(enc);
export const revealAccountNumber  = (enc: string) => decryptField(enc);
export const revealDateOfBirth    = (enc: string) => decryptField(enc);
export const revealGeneral        = (enc: string) => decryptField(enc);

export function revealSecure<T = any>(enc: string): T {
  return JSON.parse(decryptSecure(enc));
}

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH HASH LOOKUP — For queries
// ─────────────────────────────────────────────────────────────────────────────
export function searchHashFor(input: string, field: SearchableField): string {
  const normalizers: Record<SearchableField, (s: string) => string> = {
    email:    normalize.email,
    phone:    normalize.phone,
    username: normalize.username,
    nin:      normalize.nin,
    bvn:      normalize.bvn,
  };
  return generateSearchHash(normalizers[field](input), field);
}
