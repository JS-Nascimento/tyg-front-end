// middleware.ts
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { isPublicRoute, isStaticFile } from '@/app/config/route';

export default withAuth(
  async function middleware(request: NextRequestWithAuth) {
    const pathname = request.nextUrl.pathname;

    if (isStaticFile(pathname) || isPublicRoute(pathname)) {
      return NextResponse.next();
    }

    const token = request.nextauth.token;

    if (!token) {
      const callbackUrl = encodeURIComponent(request.url);
      return NextResponse.redirect(
        new URL(`/auth/login?callbackUrl=${callbackUrl}`, request.url)
      );
    }

    const tokenExpireIn = token.expiresIn as number;

    if (tokenExpireIn && Date.now() > tokenExpireIn) {
      return NextResponse.redirect(
        new URL('/auth/login?error=SessionExpired', request.url)
      );
    }

    const response = NextResponse.next();
    const securityHeaders = {
      'x-middleware-cache': 'no-cache',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    };

    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        if (isStaticFile(pathname) || isPublicRoute(pathname)) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};