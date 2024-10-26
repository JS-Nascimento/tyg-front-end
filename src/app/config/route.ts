// config/routes.ts
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
  'public',
  'assets',
  'auth',
] as const;

export const getMiddlewareConfig = () => ({
  matcher: [
    // Adiciona :path* para cada rota protegida
    ...PROTECTED_ROUTES.map(route => `${route}/:path*`),
    // Cria o padrão de exclusão
    `/((?!${EXCLUDED_ROUTES.join('|')}).*)`
  ]
});
