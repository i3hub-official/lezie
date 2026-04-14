import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { auth } from '$lib/server/auth';
import { dev } from '$app/environment';

// ==================== 1. ROUTE CONFIG ====================
const ROUTE_CONFIG = {
  PUBLIC_EXACT: new Set([
    '/signin',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/verify',
    '/faq',
    '/contact',
    '/about',
    '/terms',
    '/privacy',
    '/safety-guidelines',
    '/blog',
    '/cookies',
  ]),

  PUBLIC_PREFIX: [
    '/api/auth',
    '/api/resend-verification',
    '/api/create-email-ref',
    '/api/verify-code',
    '/api/login-resolver',
    '/api/signin',
    '/api/health',
    '/api/statistics',
    '/api/debug/cloudinary',
    '/_app',
    '/favicon',
  ],

  VERIFIED_ONLY: [
    '/dashboard', '/alerts', '/map', '/report',
    '/incident', '/safety-quest', '/profile', '/settings',
  ],
} as const;

function isPublicRoute(pathname: string): boolean {
  if (ROUTE_CONFIG.PUBLIC_EXACT.has(pathname)) return true;
  return ROUTE_CONFIG.PUBLIC_PREFIX.some(p => pathname.startsWith(p));
}

function requiresVerification(pathname: string): boolean {
  return ROUTE_CONFIG.VERIFIED_ONLY.some(p => pathname.startsWith(p));
}

// ==================== 2. RATE LIMITER ====================
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_RULES: Record<string, { max: number; windowMs: number }> = {
  '/signin':                   { max: 10, windowMs: 60_000 },
  '/signup':                   { max: 5,  windowMs: 60_000 },
  '/forgot-password':          { max: 5,  windowMs: 60_000 },
  '/api/resend-verification':  { max: 3,  windowMs: 60_000 },
  '/api':                      { max: 100,windowMs: 60_000 },
};

function checkRateLimit(ip: string, pathname: string): boolean {
  const rule = Object.entries(RATE_LIMIT_RULES).find(([path]) => pathname.startsWith(path))?.[1];
  if (!rule) return true;

  const key   = `${ip}:${pathname}`;
  const now   = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + rule.windowMs });
    return true;
  }
  entry.count++;
  return entry.count <= rule.max;
}

// ==================== 3. MIDDLEWARE HANDLERS ====================

const requestLogging: Handle = async ({ event, resolve }) => {
  const start    = Date.now();
  const response = await resolve(event);
  if (dev) {
    const ms   = Date.now() - start;
    const icon = response.status >= 400 ? '❌' : '✅';
    console.log(`${icon} [${response.status}] ${event.request.method} ${event.url.pathname} — ${ms}ms`);
  }
  return response;
};

const rateLimiting: Handle = async ({ event, resolve }) => {
  let ip = '127.0.0.1';
  try { ip = event.getClientAddress(); } catch { /* fallback */ }

  if (!checkRateLimit(ip, event.url.pathname)) {
    return new Response(JSON.stringify({ error: 'Too many requests.' }), {
      status:  429,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return resolve(event);
};

const authSession: Handle = async ({ event, resolve }) => {
  const path   = event.url.pathname;
  const method = event.request.method;

  if (dev) {
    console.log('\n=== AUTH REQUEST ===');
    console.log(`[AUTH] ${method} ${path}`);
    console.log('[AUTH] Cookies:', event.request.headers.get('cookie'));
    console.log('[AUTH] Authorization header:', event.request.headers.get('authorization'));
  }

  // Let Better Auth handle its own API routes
  if (path.startsWith('/api/auth')) {
    if (dev) console.log('[AUTH] Passing to Better Auth handler');
    return auth.handler(event.request);
  }

  // ── Resolve session ────────────────────────────────────────────────────────
  let sessionResult: Awaited<ReturnType<typeof auth.api.getSession>> = null;
  let sessionError: unknown = null;

  try {
    if (dev) console.log('[AUTH] Attempting to get session...');
    sessionResult = await auth.api.getSession({ headers: event.request.headers });

    if (dev) {
      console.log('[AUTH] Session result:', sessionResult ? '✅ Found' : '❌ Not found');
      if (sessionResult) {
        console.log('[AUTH] Session details:', {
          userId:        sessionResult.user.id,
          email:         sessionResult.user.email,
          emailVerified: sessionResult.user.emailVerified,
          expiresAt:     sessionResult.session.expiresAt,
        });
        const expired = Date.now() > new Date(sessionResult.session.expiresAt).getTime();
        console.log('[AUTH] Session expired?', expired);
        if (expired) {
          console.log('[AUTH] ⚠️ Session is EXPIRED by',
            Math.floor((Date.now() - new Date(sessionResult.session.expiresAt).getTime()) / 1000), 'seconds');
        }
      }
    }
  } catch (err) {
    sessionError = err;
    console.error('[AUTH] ❌ Error getting session:', err);
  }

  // ── Process session — TypeScript-safe null narrowing ──────────────────────
  const now = Date.now();

  if (sessionResult && !sessionError) {
    const isExpired = now > new Date(sessionResult.session.expiresAt).getTime();
    if (!isExpired) {
      event.locals.user    = sessionResult.user;
      event.locals.session = sessionResult.session;
      if (dev) console.log('[AUTH] ✅ Session set for user:', sessionResult.user.id);
    } else {
      if (dev) console.warn('[AUTH] 🕒 Expired session');
      event.locals.user    = null;
      event.locals.session = null;
    }
  } else {
    if (!sessionResult && dev) console.warn('[AUTH] ⚠️ No session found');
    event.locals.user    = null;
    event.locals.session = null;
  }

  // ── Route checks ───────────────────────────────────────────────────────────
  const isPublic         = isPublicRoute(path);
  const needsVerification = requiresVerification(path);

  if (dev) {
    console.log('[AUTH] Route info:', {
      path,
      isPublic,
      needsVerification,
      hasSession:      !!event.locals.session,
      isAuthenticated: !!event.locals.session && !!event.locals.user,
    });
  }

  // Unauthenticated → redirect to signin
  if (!event.locals.session && !isPublic) {
    if (dev) console.log(`[AUTH] 🛡️ Guest blocked from ${path}`);
    const next = path !== '/' ? `?redirectTo=${encodeURIComponent(path)}` : '';
    throw redirect(303, `/signin${next}`);
  }

  // Authenticated but email NOT verified → redirect to verify-email page
  const user    = event.locals.user;
  const session = event.locals.session;

  if (session && user && !user.emailVerified && needsVerification) {
    if (dev) console.log(`[AUTH] 📧 Unverified user redirected from ${path}`);
    throw redirect(303, `/verify-email?redirectTo=${encodeURIComponent(path)}`);
  }

  // Authenticated + verified on auth pages → redirect to dashboard
  if (session && user?.emailVerified && ROUTE_CONFIG.PUBLIC_EXACT.has(path)) {
    throw redirect(303, '/dashboard');
  }

  if (dev) console.log('[AUTH] ✅ Request proceeding\n');
  return resolve(event);
};

const cacheControl: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  const path     = event.url.pathname;

  const isStaticAsset =
    path.startsWith('/_app') ||
    path.startsWith('/favicon') ||
    /\.(ico|png|jpg|jpeg|svg|webp|woff2?|ttf|otf|css|js)$/.test(path);

  if (!isStaticAsset) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    response.headers.set('Pragma',        'no-cache');
    response.headers.set('Expires',       '0');
  }

  return response;
};

// ==================== 4. FINAL SEQUENCE ====================
export const handle: Handle = sequence(
  requestLogging,
  rateLimiting,
  authSession,
  cacheControl,
);