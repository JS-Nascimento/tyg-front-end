// src/types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  // Tipo base para informações do token
  interface TokenData {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType?: string;
  }

  // Tipo base para informações do usuário
  interface UserData {
    id: string;
    name: string;
    email: string;
    avatar: string;
  }

  // Estende o tipo base do usuário com informações do token
  interface User extends UserData, TokenData {}

  // JWT herda as informações de token e inclui campos adicionais do JWT
  interface JWT extends TokenData {
    sub?: string;
    error?: string;
  }

  // Session organiza as informações de forma estruturada
  interface Session {
    user: UserData;
    token: TokenData;
    error?: string;
  }
}