import { env } from '$env/dynamic/private';
import crypto from 'crypto';

/**
 * Internal helper to grab keys only when needed.
 * This prevents "missing env" errors during module load/build.
 */
function getKeys() {
  const masterKey = env.ENCRYPTION_KEY;
  const pepper = env.SEARCH_HASH_PEPPER;

  if (!masterKey) throw new Error('CRITICAL: ENCRYPTION_KEY is missing from env');
  if (!pepper) throw new Error('CRITICAL: SEARCH_HASH_PEPPER is missing from env');

  return {
    masterKey: Buffer.from(masterKey, 'hex'),
    pepper
  };
}

function getFixedIV(field: string): Buffer {
  const name = `FIXED_IV_${field.toUpperCase()}`;
  const raw = env[name];
  if (!raw) throw new Error(`CRITICAL: ${name} is missing from env`);
  return Buffer.from(raw, 'hex');
}

const VERSION_PREFIX = 'v1';

// ─────────────────────────────────────────────────────────────────────────────
// TIER 1: Searchable Deterministic
// ─────────────────────────────────────────────────────────────────────────────
export type SearchableField = 'email' | 'phone' | 'username' | 'nin' | 'bvn';

export function encryptSearchable(data: string, field: SearchableField): string {
  if (!data) return '';
  const { masterKey } = getKeys();
  const iv = getFixedIV(field);
  
  const cipher = crypto.createCipheriv('aes-256-cbc', masterKey, iv);
  const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
  return `${VERSION_PREFIX}:${encrypted.toString('hex')}`;
}

export function decryptSearchable(payload: string, field: SearchableField): string {
  if (!payload) return '';
  const [version, encHex] = payload.split(':');
  if (version !== 'v1') throw new Error('Unsupported encryption version');

  const { masterKey } = getKeys();
  const iv = getFixedIV(field);
  
  const decipher = crypto.createDecipheriv('aes-256-cbc', masterKey, iv);
  return decipher.update(encHex, 'hex', 'utf8') + decipher.final('utf8');
}

// ─────────────────────────────────────────────────────────────────────────────
// TIER 2: Random IV
// ─────────────────────────────────────────────────────────────────────────────
export function encryptField(data: string): string {
  if (!data) return '';
  const { masterKey } = getKeys();
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv('aes-256-cbc', masterKey, iv);
  const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
  return `${VERSION_PREFIX}:${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptField(payload: string): string {
  if (!payload) return '';
  const [version, ivHex, encHex] = payload.split(':');
  if (version !== 'v1') throw new Error('Unsupported version');

  const { masterKey } = getKeys();
  const decipher = crypto.createDecipheriv('aes-256-cbc', masterKey, Buffer.from(ivHex, 'hex'));
  return decipher.update(encHex, 'hex', 'utf8') + decipher.final('utf8');
}

// ─────────────────────────────────────────────────────────────────────────────
// TIER 3: Authenticated GCM
// ─────────────────────────────────────────────────────────────────────────────
export function encryptSecure(data: string, contextId: string): string {
  if (!data) return '';
  const { masterKey } = getKeys();
  const iv = crypto.randomBytes(12);
  
  const cipher = crypto.createCipheriv('aes-256-gcm', masterKey, iv);
  cipher.setAAD(Buffer.from(contextId)); 
  
  const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  
  return `${VERSION_PREFIX}:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptSecure(payload: string, contextId: string): string {
  if (!payload) return '';
  const [version, ivHex, tagHex, encHex] = payload.split(':');
  if (version !== 'v1') throw new Error('Unsupported version');

  const { masterKey } = getKeys();
  const decipher = crypto.createDecipheriv('aes-256-gcm', masterKey, Buffer.from(ivHex, 'hex'));
  
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  decipher.setAAD(Buffer.from(contextId));

  return decipher.update(encHex, 'hex', 'utf8') + decipher.final('utf8');
}

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH HASH
// ─────────────────────────────────────────────────────────────────────────────
export function generateSearchHash(input: string, context: string): string {
  const { pepper } = getKeys();
  return crypto.createHmac('sha512', pepper).update(`${context}:${input}`).digest('hex');
}
