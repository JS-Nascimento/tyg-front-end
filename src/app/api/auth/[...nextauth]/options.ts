// src/app/api/auth/[...nextauth]/options.ts
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions, User } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing email or password');
          return null;
        }

        // Lógica de autenticação simulada
        if (credentials.email === 'sardinha.jorge@gmail.com' && credentials.password === 'senha123') {
          const user: User = { id: '123', name: 'Jorge', email: 'sardinha.jorge@gmail.com' };
          console.log('User authenticated:', user);
          return user;
        }

        console.log('Invalid credentials');
        // Se a autenticação falhar, retorne null
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as User;
      return session;
    },
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
};
