import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const correlationId = request.headers.get('x-correlation-id') || `sg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  
  // Auth routes (login/signup)
  const isAuthPage =
    path === '/login' ||
    path === '/signup' ||
    path === '/forgot-password' ||
    path === '/reset-password' ||
    path === '/verify-email';

  // Protected routes that require authentication
  const isProtectedRoute =
    path.startsWith('/dashboard') ||
    path.startsWith('/reports') ||
    path.startsWith('/api/analyze') ||
    path.startsWith('/api/exports');
  
  const sessionCookie = request.cookies.get('sg_session')?.value;
  const payload = sessionCookie ? await decrypt(sessionCookie) : null;
  
  // 1. Redirect unauthenticated users away from protected routes
  if (!payload && isProtectedRoute) {
    if (path.startsWith('/api/')) {
      const res = NextResponse.json({ success: false, error: 'Unauthorized. Please sign in.' }, { status: 401 });
      res.headers.set('X-Correlation-ID', correlationId);
      return res;
    }
    const loginUrl = new URL('/login', request.nextUrl);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Redirect authenticated users away from login/signup to home/dashboard
  if (payload && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }
  
  const response = NextResponse.next();

  // Attach Security Headers & Correlation ID
  response.headers.set('X-Correlation-ID', correlationId);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
