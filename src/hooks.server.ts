import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);

  const url = event.url.pathname;

  // Pages that MUST always load fresh (no caching)
  const noCachePaths = [
    '/dashboard',
    '/signup',
    '/login',
    '/report',
    '/profile',
    '/settings',
  '/contact', '/safety-guidelines', '/faq'
    // Add any other dynamic or private pages here
  ];

  if (noCachePaths.some(path => url === path || url.startsWith(path + '/'))) {
    // Force real-time refresh - no browser or proxy caching
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
    );
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  } 
  else if (url === '/' || url === '/home') {
    // Homepage can be cached (good for performance)
    response.headers.set(
      'Cache-Control',
      'public, max-age=3600, stale-while-revalidate=86400'
    );
  } 
  else {
    // All other pages - moderate caching (you can adjust)
    response.headers.set(
      'Cache-Control',
      'public, max-age=300, stale-while-revalidate=600'
    );
  }

  return response;
};