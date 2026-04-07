import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);

  const url = event.url.pathname;

  // === SHUTDOWN / MAINTENANCE MODE ===
  const isShutdown = process.env.SHUTDOWN_MODE === 'true' || 
                     process.env.MAINTENANCE_MODE === 'true';

  if (isShutdown) {
    // Return maintenance page for all routes except static assets
    if (!url.startsWith('/_app') && !url.startsWith('/icons') && !url.endsWith('.png') && !url.endsWith('.jpg')) {
      return new Response(null, {
        status: 503,
        headers: {
          'Content-Type': 'text/html',
          'Retry-After': '300', // 5 minutes
          'Cache-Control': 'no-store, no-cache'
        }
      });
    }
  }

  // === CACHE CONTROL ===
  const noCachePaths = [
    '/dashboard', '/signup', '/login', '/report', 
    '/profile', '/settings', '/contact', 
    '/safety-guidelines', '/faq'
  ];

  if (noCachePaths.some(path => url === path || url.startsWith(path + '/'))) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  } 
  else if (url === '/' || url === '/home') {
    response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  } 
  else {
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
  }

  return response;
};