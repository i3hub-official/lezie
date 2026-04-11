import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { auth } from '$lib/server/auth';
import { dev } from '$app/environment';

// ==================== 1. ROUTE CONFIG ====================
/**
 * The single source of truth for routing behaviour.
 *
 * PUBLIC_EXACT   — paths matched character-for-character
 * PUBLIC_PREFIX  — any path that *starts with* these strings
 *
 * Everything not listed here is PROTECTED by default.
 * To open a new route: add it to the right list and you're done.
 */
const ROUTE_CONFIG = {
  PUBLIC_EXACT: new Set([
'/',
    '/signin',
    '/signup',
    '/forgot-password',
    '/reset-password',
  ]),

  PUBLIC_PREFIX: [
    '/api/auth',   // Better Auth internal endpoints
    '/_app',       // SvelteKit build assets
    '/favicon',    // Favicon requests
  ],
} as const;

/** Returns true if the path is publicly accessible without a session */
function isPublicRoute(pathname: string): boolean {
  if (ROUTE_CONFIG.PUBLIC_EXACT.has(pathname)) return true;
  return ROUTE_CONFIG.PUBLIC_PREFIX.some(p => pathname.startsWith(p));
}

// ==================== 2. RATE LIMITER ====================
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_RULES: Record<string, { max: number; windowMs: number }> = {
  '/signin':          { max: 10,  windowMs: 60_000 },
  '/signup':          { max: 5,   windowMs: 60_000 },
  '/forgot-password': { max: 5,   windowMs: 60_000 },
  '/api':             { max: 100, windowMs: 60_000 },
};

function checkRateLimit(ip: string, pathname: string): boolean {
  const rule = Object.entries(RATE_LIMIT_RULES).find(([path]) => pathname.startsWith(path))?.[1];
  if (!rule) return true;

  const key = `${ip}:${pathname}`;
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + rule.windowMs });
    return true;
  }
  entry.count++;
  return entry.count <= rule.max;
}

// ==================== 3. MIDDLEWARE HANDLERS ====================

/**
 * LOGGING: Monitor request performance in dev
 */
const requestLogging: Handle = async ({ event, resolve }) => {
  const start = Date.now();
  const response = await resolve(event);
  if (dev) {
    const ms = Date.now() - start;
    const icon = response.status >= 400 ? '❌' : '✅';
    console.log(`${icon} [${response.status}] ${event.request.method} ${event.url.pathname} — ${ms}ms`);
  }
  return response;
};

/**
 * RATE LIMITING: Prevent brute force on auth endpoints
 */
const rateLimiting: Handle = async ({ event, resolve }) => {
  let ip = '127.0.0.1';
  try { ip = event.getClientAddress(); } catch { /* Termux fallback */ }

  if (!checkRateLimit(ip, event.url.pathname)) {
    return new Response(JSON.stringify({ error: 'Too many requests.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return resolve(event);
};

/**
 * AUTHENTICATION & SECURITY
 * Handles: Better Auth API, session resolve, route protection,
 *          session expiry, post-login redirect, auth-page bypass
 */
const authSession: Handle = async ({ event, resolve }) => {
  // 1. Let Better Auth handle its own API routes
  if (event.url.pathname.startsWith('/api/auth')) {
    return auth.handler(event.request);
  }

  // 2. Resolve session
  const sessionResult = await auth.api.getSession({
    headers: event.request.headers
  });

  const path = event.url.pathname;
  const now  = Date.now();
  const isExpired =
    sessionResult && now > new Date(sessionResult.session.expiresAt).getTime();

  if (sessionResult && !isExpired) {
    // Valid session
    event.locals.user    = sessionResult.user;
    event.locals.session = sessionResult.session;
  } else {
    // No session or expired
    if (isExpired && dev) {
      console.warn(`[AUTH] 🕒 Expired session for user: ${sessionResult!.user.id}`);
    }
    event.locals.user    = null;
    event.locals.session = null;
  }

  // 3. Unauthenticated: only public routes are accessible — everything else → /signin
  //    This covers '/', '/dashboard', '/alerts', any future route automatically.
  if (!event.locals.session && !isPublicRoute(path)) {
    if (dev) console.log(`[AUTH] 🛡️ Guest blocked from ${path}`);

    // Carry the intended destination so the signin page can redirect back after login
    const next = path !== '/' ? `?redirectTo=${encodeURIComponent(path)}` : '';
    throw redirect(303, `/signin${next}`);
  }

  // 4. Expired session specifically → tell the user why
  if (!event.locals.session && isExpired && !isPublicRoute(path)) {
    throw redirect(303, '/signin?error=session_expired');
  }

  // 5. Authenticated users have no reason to see auth pages → dashboard
  if (event.locals.session && ROUTE_CONFIG.PUBLIC_EXACT.has(path)) {
    throw redirect(303, '/dashboard');
  }

  return resolve(event);
};

/**
 * CACHE CONTROL: Prevent sensitive pages from being cached
 */
const cacheControl: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  const path = event.url.pathname;

  if (path.startsWith('/dashboard') || path.startsWith('/api')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }
  return response;
};

// ==================== 4. FINAL SEQUENCE ====================
export const handle: Handle = sequence(
  requestLogging,
  rateLimiting,
  authSession,
  cacheControl
);