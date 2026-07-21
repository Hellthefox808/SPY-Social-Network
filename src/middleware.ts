import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const correlationId = request.headers.get('x-correlation-id') || `sg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  
  // Public routes
  const isPublicRoute =
    path === '/' ||
    path === '/login' ||
    path === '/signup' ||
    path === '/forgot-password' ||
    path === '/reset-password' ||
    path === '/verify-email' ||
    path.startsWith('/api/auth') ||
    path.startsWith('/dashboard') ||
    path.startsWith('/reports');
  
  const sessionCookie = request.cookies.get('sg_session')?.value;
  const payload = sessionCookie ? await decrypt(sessionCookie) : null;
  
  if (!payload && !isPublicRoute) {
    if (path.startsWith('/api/')) {
      const res = NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      res.headers.set('X-Correlation-ID', correlationId);
      return res;
    }
    return NextResponse.redirect(new URL('/login', request.nextUrl));
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
