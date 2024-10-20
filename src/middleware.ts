// middleware.ts
//
export { default } from "next-auth/middleware";

export const config = {
  matcher: ['/home', '/account/:path*', '/dashboard/:path*', '/analysis/:path*'],
};

//
//
// import { withAuth } from 'next-auth/middleware';
//
// export default withAuth({
//   pages: {
//     signIn: '/auth/login', // Página de login personalizada
//   },
// });
//
// export const config = {
//   matcher: ['/', '/home', '/account/:path*', '/dashboard/:path*', '/analysis/:path*'],
// };
//
