// src/types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {

  interface TokenData {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType?: string;
  }

  interface UserData {
    id: string;
    name: string;
    email: string;
    avatar: string;
  }

  interface User extends UserData, TokenData {}

  interface JWT extends TokenData {
    sub?: string;
    error?: string;
  }
  interface Session {
    expires: string;
    user: UserData;
    token: TokenData;
    error?: string;
  }
}