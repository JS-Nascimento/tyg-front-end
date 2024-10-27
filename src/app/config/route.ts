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
  'tyg-logo.png', // Adiciona sua imagem específica
  'public',
  'assets',
  'auth',
  'api',
  // Adiciona extensões comuns de arquivos estáticos
  '.*\\.(?:jpg|jpeg|gif|png|svg|ico|css|js|woff|woff2|ttf|eot)',
] as const;

export const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/about',
  '/actuator',
] as const;

export const getMiddlewareConfig = () => ({
  matcher: [
    // Rotas protegidas com wildcard
    ...PROTECTED_ROUTES.map(route => `${route}/:path*`),

    // Exclui todas as rotas definidas em EXCLUDED_ROUTES
    `/((?!${EXCLUDED_ROUTES.join('|')}).*)`
  ]
});

// Função auxiliar para verificar se uma rota é pública
export const isPublicRoute = (pathname: string) => {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route));
};

// Função auxiliar para verificar se é um arquivo estático
export const isStaticFile = (pathname: string) => {
  return EXCLUDED_ROUTES.some(route => {
    if (route.startsWith('.*\\.')) {
      // Se for um padrão de extensão, converte para RegExp
      const regex = new RegExp(route);
      return regex.test(pathname);
    }
    return pathname.startsWith('/' + route);
  });
};