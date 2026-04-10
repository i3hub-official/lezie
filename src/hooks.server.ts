import type { Handle } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { sequence } from '@sveltejs/kit/hooks';

// ==================== RATE LIMITER ====================

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_RULES: Record<string, { max: number; windowMs: number }> = {
  '/login':   { max: 10,  windowMs: 60_000 },   // 10 attempts / min
  '/signup':  { max: 5,   windowMs: 60_000 },   // 5 attempts / min
  '/api':     { max: 100, windowMs: 60_000 },   // 100 req / min
};

function getRateLimit(pathname: string) {
  for (const [path, rule] of Object.entries(RATE_LIMIT_RULES)) {
    if (pathname === path || pathname.startsWith(path + '/')) return rule;
  }
  return null;
}

function checkRateLimit(ip: string, pathname: string): boolean {
  const rule = getRateLimit(pathname);
  if (!rule) return true;

  const key   = `${ip}:${pathname}`;
  const now   = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + rule.windowMs });
    return true;
  }

  entry.count++;
  if (entry.count > rule.max) return false;

  return true;
}

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore) {
    if (now > entry.resetAt) rateLimitStore.delete(key);
  }
}, 5 * 60_000);

// ==================== SECURITY HEADERS ====================

const securityHeaders: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Prevent MIME sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Force HTTPS (1 year, include subdomains)
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy — disable features Lezie doesn't need
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), payment=(), usb=(), interest-cohort=()'
  );

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",          // unsafe-inline needed for SvelteKit SSR
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",          // blob/https for map tiles & avatars
      "connect-src 'self' https://*.neon.tech wss:", // Neon DB + websockets
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  );

  return response;
};

// ==================== AUTH SESSION ====================

const authSession: Handle = async ({ event, resolve }) => {
  const session = await auth.api.getSession({ headers: event.request.headers });

  if (session) {
    event.locals.user    = session.user;
    event.locals.session = session.session;
  } else {
    event.locals.user    = null;
    event.locals.session = null;
  }

  return resolve(event);
};

// ==================== RATE LIMITING ====================

const rateLimiting: Handle = async ({ event, resolve }) => {
  const ip       = event.getClientAddress();
  const pathname = event.url.pathname;

  if (!checkRateLimit(ip, pathname)) {
    const rule = getRateLimit(pathname)!;
    console.warn(`[rate-limit] ${ip} exceeded limit on ${pathname}`);
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please slow down.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(rule.windowMs / 1000),
        },
      }
    );
  }

  return resolve(event);
};

// ==================== REQUEST LOGGING ====================

const requestLogging: Handle = async ({ event, resolve }) => {
  const start    = Date.now();
  const method   = event.request.method;
  const pathname = event.url.pathname;

  const response = await resolve(event);

  const ms     = Date.now() - start;
  const status = response.status;
  const color  =
    status >= 500 ? '\x1b[31m' :   // red
    status >= 400 ? '\x1b[33m' :   // yellow
    status >= 300 ? '\x1b[36m' :   // cyan
                    '\x1b[32m';    // green

  console.log(`${color}[${status}]\x1b[0m ${method} ${pathname} — ${ms}ms`);

  return response;
};

// ==================== CACHE CONTROL ====================

const cacheControl: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  const url      = event.url.pathname;

  const noCachePaths = [
    '/dashboard',
    '/signup',
    '/login',
    '/report',
    '/profile',
    '/settings',
    '/contact',
    '/safety-guidelines',
    '/faq',
  ];

  if (noCachePaths.some(p => url === p || url.startsWith(p + '/'))) {
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
    );
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  } else if (url === '/' || url === '/home') {
    response.headers.set(
      'Cache-Control',
      'public, max-age=3600, stale-while-revalidate=86400'
    );
  } else {
    response.headers.set(
      'Cache-Control',
      'public, max-age=300, stale-while-revalidate=600'
    );
  }

  return response;
};

// ==================== EXPORT ====================

export const handle: Handle = sequence(
  requestLogging,
  rateLimiting,
  securityHeaders,
  authSession,
  cacheControl
);