import 'dotenv/config';
import crypto from 'crypto';

function mustHexEnv(name: string, bytes: number): Buffer {
  const raw = process.env[name];
  if (!raw) throw new Error(`CRITICAL: ${name} is missing`);
  const buf = Buffer.from(raw, 'hex');
  if (buf.length !== bytes) throw new Error(`${name} size mismatch`);
  return buf;
}

const ENCRYPTION_KEY_V1 = mustHexEnv('ENCRYPTION_KEY', 32);
const VERSION_PREFIX = 'v1';

const FIXED_IV = {
  email:    mustHexEnv('FIXED_IV_EMAIL',    16),
  phone:    mustHexEnv('FIXED_IV_PHONE',    16),
  username: mustHexEnv('FIXED_IV_USERNAME', 16),
  nin:      mustHexEnv('FIXED_IV_NIN',      16),
  bvn:      mustHexEnv('FIXED_IV_BVN',      16),
};

// --- TIER 1: Searchable ---
export function encryptSearchable(data: string, field: keyof typeof FIXED_IV): string {
  if (!data) return ''; 
  const iv = FIXED_IV[field];
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY_V1, iv);
  const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
  return `${VERSION_PREFIX}:${encrypted.toString('hex')}`;
}

export function decryptSearchable(payload: string, field: keyof typeof FIXED_IV): string {
  if (!payload) return '';
  const [version, encHex] = payload.split(':');
  if (version !== 'v1') throw new Error('Unsupported key version');
  
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY_V1, FIXED_IV[field]);
  return decipher.update(encHex, 'hex', 'utf8') + decipher.final('utf8');
}

// --- TIER 2: Random IV ---
export function encryptField(data: string): string {
  if (!data) return '';
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY_V1, iv);
  const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
  return `${VERSION_PREFIX}:${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptField(payload: string): string {
  if (!payload) return '';
  const [version, ivHex, encHex] = payload.split(':');
  if (version !== 'v1') throw new Error('Unsupported key version');
  
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY_V1, Buffer.from(ivHex, 'hex'));
  return decipher.update(encHex, 'hex', 'utf8') + decipher.final('utf8');
}

// --- TIER 3: Authenticated (GCM) with Context Binding ---
export function encryptSecure(data: string, contextId: string): string {
  if (!data) return '';
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY_V1, iv);
  
  // AAD: Binds the ciphertext to a specific ID (e.g. UserID) 
  // to prevent moving encrypted blobs between database rows.
  cipher.setAAD(Buffer.from(contextId)); 
  
  const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
  return `${VERSION_PREFIX}:${iv.toString('hex')}:${cipher.getAuthTag().toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptSecure(payload: string, contextId: string): string {
  if (!payload) return '';
  const [version, ivHex, tagHex, encHex] = payload.split(':');
  if (version !== 'v1') throw new Error('Unsupported key version');

  const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY_V1, Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  decipher.setAAD(Buffer.from(contextId));

  return decipher.update(encHex, 'hex', 'utf8') + decipher.final('utf8');
}

// --- Search Hash ---
export function generateSearchHash(input: string, context: string): string {
  const pepper = process.env.SEARCH_HASH_PEPPER || '';
  return crypto.createHmac('sha512', pepper).update(`${context}:${input}`).digest('hex');
}
