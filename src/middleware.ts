// middleware.ts
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getMiddlewareConfig, isPublicRoute, isStaticFile } from '@/app/config/route';

const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/about',
  '/actuator',
];

// Array de extensões e pastas que devem ser ignoradas pelo middleware
const publicFiles = [
  '/favicon.ico',
  '/tyg-logo.png', // ou qualquer outra imagem específica
  '/_next',        // arquivos do Next.js
  '/images',       // pasta de imagens se você tiver uma
  '/assets',       // outros assets
  '/public',       // pasta public inteira
];

export default withAuth(
  async function middleware(request: NextRequestWithAuth) {
    const pathname = request.nextUrl.pathname;

    // Verifica se é arquivo estático ou rota pública
    if (isStaticFile(pathname) || isPublicRoute(pathname)) {
      return NextResponse.next();
    }

    // Verifica o token que já está disponível através do NextRequestWithAuth
    const token = request.nextauth.token;

    // Se não houver token
    if (!token) {
      const callbackUrl = encodeURIComponent(request.url);
      return NextResponse.redirect(
        new URL(`/auth/login?callbackUrl=${callbackUrl}`, request.url)
      );
    }

    // Verifica se o token está expirado
    const tokenExpireIn = token.expiresIn as number;

    if (tokenExpireIn && Date.now() > tokenExpireIn) {
      return NextResponse.redirect(
        new URL('/auth/login?error=SessionExpired', request.url)
      );
    }

    // Adiciona headers de segurança
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

export const config = getMiddlewareConfig();