// src/app/api/auth/[...nextauth]/options.ts
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';
import { jwtVerify } from 'jose';
import { JWT } from 'next-auth/jwt';

interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
  tokenType: string;
}

interface TokenPayload {
  sub: string;
  preferred_username: string;
  iat: number;
  exp: number;
}

async function verifyAndDecodeToken(token: string): Promise<TokenPayload> {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
    );
    return payload as unknown as TokenPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw error;
  }
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(
      `${process.env.URL_API_TYG_INVESTMENTS}/refresh`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: token.refreshToken }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    const refreshedTokens: AuthResponse = await response.json();
    const decodedToken = await verifyAndDecodeToken(refreshedTokens.accessToken);

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      expiresIn: Date.now() + refreshedTokens.expiresIn,
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
      tokenType: refreshedTokens.tokenType,
      sub: decodedToken.sub,
      name: decodedToken.preferred_username,
      email: decodedToken.preferred_username,
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Missing credentials');
          }

          const response = await fetch(
            `${process.env.URL_API_TYG_INVESTMENTS}/auth`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (!response.ok) {
            throw new Error('Authentication failed');
          }

          const auth: AuthResponse = await response.json();
          const decodedToken = await verifyAndDecodeToken(auth.accessToken);

          return {
            id: decodedToken.sub,
            name: decodedToken.preferred_username,
            email: credentials.email,
            accessToken: auth.accessToken,
            refreshToken: auth.refreshToken,
            expiresIn: Date.now() + auth.expiresIn,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user}) {

      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expiresIn = user.expiresIn;
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        return token;
      }

      const now = Date.now()/1000;

      if (typeof token.expiresIn === 'number' && token.expiresIn < now) {
        return token;
      }

      // Access token expired, refresh it
      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (token.error) {
        return { ...session, error: token.error };
      }

      return {
        ...session,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        user: {
          id: token.sub!,
          name: token.name!,
          email: token.email!,
        },
      };
    },
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};