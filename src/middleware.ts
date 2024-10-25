// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Lista de rotas públicas que não precisam de autenticação
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/about',
  '/actuator',
];

// Lista de rotas protegidas (opcional, já que usamos matcher)
const protectedRoutes = [
  '/home',
  '/account',
  '/dashboard',
  '/analysis',
];

export default withAuth(
  async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    // Verifica se é uma rota pública
    if (publicRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next();
    }

    // Obtém o token da requisição (não precisa chamar getToken explicitamente
    // pois o withAuth já faz isso)
    const token = req.nextauth.token;

    // Se não houver token e for uma rota protegida
    if (!token) {
      // Guarda a URL que o usuário tentou acessar
      const callbackUrl = encodeURIComponent(req.url);
      return NextResponse.redirect(
        new URL(`/auth/login?callbackUrl=${callbackUrl}`, req.url)
      );
    }

    // Verifica se o token está expirado
    const tokenExpiry = token.expiresIn as number;
    if (tokenExpiry && Date.now() > tokenExpiry) {
      // Redireciona para login com mensagem de sessão expirada
      return NextResponse.redirect(
        new URL('/auth/login?error=SessionExpired', req.url)
      );
    }

    // Adiciona headers de segurança
    const response = NextResponse.next();
    response.headers.set('x-middleware-cache', 'no-cache');
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Permite acesso a rotas públicas
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true;
        }

        // Requer token para rotas protegidas
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|assets/).*)',
    '/home/:path*',
    '/account/:path*',
    '/dashboard/:path*',
    '/analysis/:path*'
  ],
};