import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function getSessionUser(request: NextRequest) {
  const sessionCookie = request.cookies.get('civora_session');
  if (!sessionCookie?.value) return null;

  try {
    const decoded = Buffer.from(sessionCookie.value, 'base64').toString('utf-8');
    const session = JSON.parse(decoded);
    if (!session || !session.user || (session.expiresAt && Date.now() > session.expiresAt)) {
      return null;
    }
    return session.user;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = getSessionUser(request);
  const isAuthenticated = !!user;

  // Intercept all /admin routes
  if (pathname.startsWith('/admin')) {
    // In dev mode, if dev auth is enabled and no cookie is present, allow request to proceed (handled by fallback session in server component)
    const isDevAuth = process.env.NEXT_PUBLIC_ENABLE_DEV_AUTH !== 'false';

    if (!isAuthenticated && !isDevAuth) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role check: If authenticated but NOT platform_admin, redirect to /access-denied
    if (user && user.role !== 'platform_admin') {
      return NextResponse.redirect(new URL('/access-denied', request.url));
    }
  }

  // Root path / redirects to /login
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/admin/:path*'],
};
