import { NextResponse } from 'next/server';

// Middleware to optimize logging and improve performance
export function middleware(request) {
  // Skip logging for static assets and health checks
  const path = request.nextUrl.pathname;
  
  if (
    path.startsWith('/_next/') ||
    path.startsWith('/static/') ||
    path === '/favicon.ico' ||
    path === '/health'
  ) {
    return NextResponse.next();
  }

  // Add cache headers for better performance
  const response = NextResponse.next();
  
  // Cache static assets
  if (path.match(/\.(js|css|png|jpg|jpeg|svg|gif|webp)$/i)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  return response;
}

// Configure which routes the middleware applies to
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
