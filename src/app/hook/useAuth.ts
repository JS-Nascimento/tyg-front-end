// hooks/useAuth.ts
import { useSession, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const logout = async () => {
    try {
      await signOut({
        redirect: false
      });
      router.push('/auth/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return {
    user: session?.user,
    token: session?.token,
    accessToken: session?.token?.accessToken,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    logout
  };
}

export type AuthState = {
  user: Session['user'] | undefined;
  token: Session['token'] | undefined;
  accessToken: string | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
};
