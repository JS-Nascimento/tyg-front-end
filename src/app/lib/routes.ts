// src/app/lib/routes.ts
export const PROTECTED_ROUTES = [
  '/home',
  '/account',
  '/dashboard',
  '/analysis',
] as const;

export const EXCLUDED_ROUTES = [
  '_next/static',
  '_next/image',
  'favicon.ico',
  'tyg-logo.png',
  'public',
  'assets',
  'auth',
  'api',
  '.*\\.(?:jpg|jpeg|gif|png|svg|ico|css|js|woff|woff2|ttf|eot)',
] as const;

export const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/about',
  '/actuator',
] as const;

// type Route = typeof PUBLIC_ROUTES[number] | typeof PROTECTED_ROUTES[number];

// Função auxiliar para verificar se uma rota é pública
export const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route));
};

// Função auxiliar para verificar se é um arquivo estático
export const isStaticFile = (pathname: string): boolean => {
  return EXCLUDED_ROUTES.some(route => {
    if (route.startsWith('.*\\.')) {
      const regex = new RegExp(route);
      return regex.test(pathname);
    }
    return pathname.startsWith('/' + route);
  });
};

// Função para verificar se uma rota é protegida
export const isProtectedRoute = (pathname: string): boolean => {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
};

// Middleware de autenticação
export const withAuth = (pathname: string): string | null => {
  // Se for uma rota pública ou arquivo estático, permite o acesso
  if (isPublicRoute(pathname) || isStaticFile(pathname)) {
    return null;
  }

  // Se for uma rota protegida e não estiver autenticado, redireciona para o login
  if (isProtectedRoute(pathname)) {
    return '/auth/login';
  }

  return null;
};