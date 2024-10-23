// middleware.ts

// export { default } from "next-auth/middleware";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default withAuth(
  async function middleware(req: NextRequest) {
    // Obtenha o token de autenticação do cookie
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Se o token não estiver presente e a rota não for a de login, redirecione para /auth/login
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Se o token estiver presente, permita o acesso às rotas protegidas
    return NextResponse.next();
  },
  {
    callbacks: {
      // Opção de callback para controlar se a autenticação é obrigatória para determinadas rotas
      authorized: ({ token }) => !!token,
    },
  }
);

// Defina as rotas que devem passar pelo middleware
export const config = {
  matcher: ['/:path*','/home/:path*', '/account/:path*', '/dashboard/:path*', '/analysis/:path*'],
};

