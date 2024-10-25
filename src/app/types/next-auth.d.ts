// src/types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresIn: number;
    tokenType?: string;
    sub?: string;
    name?: string;
    email?: string;
  }
}