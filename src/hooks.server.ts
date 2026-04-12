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
 * VERIFIED_ONLY  — paths that require an authenticated AND verified email.
 *                  Authenticated-but-unverified users hitting these are
 *                  redirected to /verify-email instead of /signin.
 *
 * Everything not listed in PUBLIC_* is PROTECTED by default.
 * To open a new route: add it to the right list and you're done.
 */
const ROUTE_CONFIG = {
  PUBLIC_EXACT: new Set([
    '/signin',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/verify-email',          // landing page after signup — prompts user to check email
    '/verify',                // token validation page — shows the display code
  ]),

  PUBLIC_PREFIX: [
    '/api/auth',                // Better Auth internal endpoints
    '/api/resend-verification', // resend verification email
    '/api/create-email-ref',    // called immediately after signup before cookie propagates
    '/api/verify-code',         // validates the entered code against the httpOnly cookie
    '/api/login-resolver',      // resolves email/username/phone to email for signin
    '/api/signin',              // custom signin endpoint — bypasses Zod email validation
    '/_app',                    // SvelteKit build assets
    '/favicon',                 // Favicon requests
  ],

  // Paths that require a verified email — authenticated but unverified
  // users are bounced to /verify-email rather than /signin
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
  '/signin':              { max: 10, windowMs: 60_000 },
  '/signup':              { max: 5,  windowMs: 60_000 },
  '/forgot-password':     { max: 5,  windowMs: 60_000 },
  '/api/resend-verification': { max: 3, windowMs: 60_000 }, // tight — prevent email spam
  '/api':                 { max: 100, windowMs: 60_000 },
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


const authSession: Handle = async ({ event, resolve }) => {
  const path = event.url.pathname;
  const method = event.request.method;
  
  // ==================== FULL REQUEST LOGGING ====================
  if (dev) {
    console.log('\n=== AUTH REQUEST ===');
    console.log(`[AUTH] ${method} ${path}`);
    console.log('[AUTH] Cookies:', event.request.headers.get('cookie'));
    console.log('[AUTH] Authorization header:', event.request.headers.get('authorization'));
    console.log('[AUTH] User-Agent:', event.request.headers.get('user-agent'));
  }

  // 1. Let Better Auth handle its own API routes
  if (path.startsWith('/api/auth')) {
    if (dev) console.log('[AUTH] Passing to Better Auth handler');
    return auth.handler(event.request);
  }

  // 2. Resolve session with more detailed logging
  let sessionResult = null;
  let sessionError = null;
  
  try {
    if (dev) console.log('[AUTH] Attempting to get session...');
    
    sessionResult = await auth.api.getSession({
      headers: event.request.headers
    });
    
    if (dev) {
      console.log('[AUTH] Session result:', sessionResult ? '✅ Found' : '❌ Not found');
      if (sessionResult) {
        console.log('[AUTH] Session details:', {
          userId: sessionResult.user.id,
          email: sessionResult.user.email,
          emailVerified: sessionResult.user.emailVerified,
          sessionId: sessionResult.session.id,
          expiresAt: sessionResult.session.expiresAt,
          createdAt: sessionResult.session.createdAt,
          updatedAt: sessionResult.session.updatedAt
        });
        
        // Check if session is expired
        const now = new Date();
        const expiresAt = new Date(sessionResult.session.expiresAt);
        const isExpired = now > expiresAt;
        console.log('[AUTH] Current time:', now.toISOString());
        console.log('[AUTH] Session expires:', expiresAt.toISOString());
        console.log('[AUTH] Session expired?', isExpired);
        if (isExpired) {
          console.log('[AUTH] ⚠️ Session is EXPIRED!');
          console.log('[AUTH] Expired by:', Math.floor((now.getTime() - expiresAt.getTime()) / 1000), 'seconds');
        }
      }
    }
  } catch (err) {
    sessionError = err;
    console.error('[AUTH] ❌ Error getting session:', err);
    if (err instanceof Error) {
      console.error('[AUTH] Error stack:', err.stack);
    }
  }

  // 3. Process session result
  const now = Date.now();
  const hasValidSession = sessionResult && !sessionError;
  const isExpired = hasValidSession && now > new Date(sessionResult.session.expiresAt).getTime();
  
  if (dev) {
    console.log('[AUTH] Session validation:', {
      hasSessionResult: !!sessionResult,
      hasSessionError: !!sessionError,
      isExpired,
      isValid: hasValidSession && !isExpired
    });
  }

  if (hasValidSession && !isExpired) {
    event.locals.user = sessionResult.user;
    event.locals.session = sessionResult.session;
    if (dev) {
      console.log('[AUTH] ✅ Session set in locals for user:', sessionResult.user.id);
      console.log('[AUTH] User email verified:', sessionResult.user.emailVerified);
    }
  } else {
    if (isExpired && dev) {
      console.warn(`[AUTH] 🕒 Expired session for user: ${sessionResult!.user.id}`);
      console.warn(`[AUTH] Expired at: ${sessionResult!.session.expiresAt}`);
    }
    if (sessionError && dev) {
      console.warn('[AUTH] ⚠️ Session error occurred');
    }
    if (!sessionResult && dev) {
      console.warn('[AUTH] ⚠️ No session found');
    }
    event.locals.user = null;
    event.locals.session = null;
  }

  // 4. Check if route is public
  const isPublic = isPublicRoute(path);
  const needsVerification = requiresVerification(path);
  
  if (dev) {
    console.log('[AUTH] Route info:', {
      path,
      isPublic,
      needsVerification,
      hasSession: !!event.locals.session,
      hasUser: !!event.locals.user,
      isAuthenticated: !!event.locals.session && !!event.locals.user
    });
  }

  // 5. Unauthenticated → public routes only
  if (!event.locals.session && !isPublic) {
    if (dev) {
      console.log(`[AUTH] 🛡️ Guest blocked from ${path}`);
      console.log(`[AUTH] Redirecting to /signin with redirectTo=${encodeURIComponent(path)}`);
    }
    const next = path !== '/' ? `?redirectTo=${encodeURIComponent(path)}` : '';
    throw redirect(303, `/signin${next}`);
  }

  // 6. Expired session on protected route
  if (!event.locals.session && isExpired && !isPublic) {
    if (dev) console.log('[AUTH] 🕒 Expired session redirecting to /signin');
    throw redirect(303, '/signin?error=session_expired');
  }

  // 7. Authenticated but email NOT verified
  const user = event.locals.user;
  const session = event.locals.session;
  
  if (session && user && !(user as any).emailVerified && needsVerification) {
    if (dev) {
      console.log(`[AUTH] 📧 Unverified user (${user.id}) blocked from ${path}`);
      console.log('[AUTH] User email verified status:', (user as any).emailVerified);
      console.log('[AUTH] Redirecting to /verify-email');
    }
    throw redirect(303, '/verify-email');
  }

  // 8. Authenticated + verified users on auth pages → dashboard
  if (session && (user as any)?.emailVerified && ROUTE_CONFIG.PUBLIC_EXACT.has(path)) {
    if (dev) {
      console.log(`[AUTH] ✅ Verified user (${user.id}) on auth page ${path} → redirecting to /dashboard`);
    }
    throw redirect(303, '/dashboard');
  }

  if (dev) {
    console.log('[AUTH] ✅ Request proceeding to resolver');
    console.log('=== END AUTH REQUEST ===\n');
  }

  // 9. Proceed to next handler
  return resolve(event);
};


// ==================== 4. FINAL SEQUENCE ====================
export const handle: Handle = sequence(
  requestLogging,
  rateLimiting,
  authSession,
  cacheControl
);
