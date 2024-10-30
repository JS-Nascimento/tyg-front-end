// config/routes.ts
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

// Função auxiliar para verificar se uma rota é pública
export const isPublicRoute = (pathname: string) => {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route));
};

// Função auxiliar para verificar se é um arquivo estático
export const isStaticFile = (pathname: string) => {
  return EXCLUDED_ROUTES.some(route => {
    if (route.startsWith('.*\\.')) {
      const regex = new RegExp(route);
      return regex.test(pathname);
    }
    return pathname.startsWith('/' + route);
  });
};