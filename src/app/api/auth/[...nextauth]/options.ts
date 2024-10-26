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

interface User {
  tenantId: string;
  name: string;
  email: string;
  enabled: boolean;
}

async function getUserInfo(token: string): Promise<User> {
  try {
    if (!token || token === 'undefined') {
      throw new Error('Missing token');
    }
    const response = await fetch(
      `${process.env.URL_API_TYG_INVESTMENTS}/${process.env.API_PATH_V1}/users/me`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      },
    );
    console.log('API URL:', `${process.env.URL_API_TYG_INVESTMENTS}/${process.env.API_PATH_V1}/users/me`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('Error response:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      throw new Error(`Authentication failed: ${response.status}`);
    }

    const userInfo: User = await response.json();

    if (!userInfo.tenantId || !userInfo.name) {
      throw new Error('Invalid user info response');
    }

    return {
      tenantId: userInfo.tenantId,
      name: userInfo.name,
      email: userInfo.email,
      enabled: userInfo.enabled,
    };
  } catch (error) {
    console.error('Error getting users info:', error);
    throw error;
  }

}

async function verifyAndDecodeToken(token: string): Promise<TokenPayload> {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.NEXTAUTH_SECRET),
    );
    console.log('Token payload:', payload);
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
      },
    );

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    const refreshedTokens: AuthResponse = await response.json();
    const decodedToken = await verifyAndDecodeToken(refreshedTokens.accessToken);

    const userInfo = await getUserInfo(refreshedTokens.accessToken);

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      expiresIn: Date.now() + refreshedTokens.expiresIn,
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
      tokenType: refreshedTokens.tokenType,
      sub: decodedToken.sub,
      id: userInfo.tenantId,
      name: userInfo.name,
      email: decodedToken.preferred_username,
      avatar: '',
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
            },
          );

          if (!response.ok) {
            throw new Error('Authentication failed');
          }

          const auth: AuthResponse = await response.json();
          const decodedToken = await verifyAndDecodeToken(auth.accessToken);

          const userInfo = await getUserInfo(auth.accessToken);

          return {
            id: userInfo.tenantId,
            name: userInfo.name,
            email: decodedToken.preferred_username,
            accessToken: auth.accessToken,
            refreshToken: auth.refreshToken,
            expiresIn: Date.now() + auth.expiresIn,
            tokenType: auth.tokenType,
            avatar: '',
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
    async jwt({ token, user }) {
      if (user) {
        return {
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          expiresIn: user.expiresIn,
          tokenType: user.tokenType,
          sub: user.id,
          name: user.name,
          email: user.email,
        };
      }

      const now = Date.now() / 1000;

      if (typeof token.expiresIn === 'number' && token.expiresIn < now) {
        return refreshAccessToken(token);
      }

      return token;
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