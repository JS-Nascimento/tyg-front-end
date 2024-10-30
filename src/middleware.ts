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

// Configuração estática do matcher
export const config = {
  matcher: [
    // Rotas protegidas
    '/home/:path*',
    '/account/:path*',
    '/dashboard/:path*',
    '/analysis/:path*',
    // Matcher para todas as rotas exceto as excluídas
    '/((?!_next/static|_next/image|favicon.ico|tyg-logo.png|public|assets|auth|api|.*\\.(?:jpg|jpeg|gif|png|svg|ico|css|js|woff|woff2|ttf|eot)).*)'
  ]
};