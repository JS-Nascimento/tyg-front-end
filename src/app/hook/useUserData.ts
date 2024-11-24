// hooks/useUserData.ts
import { useEffect } from 'react';
import { useUserStore } from '@/app/store/userStore';
import { useToast } from '@/app/services/ToastService';


export function useUserData() {
  const { showToast } = useToast();
  const { setUser } = useUserStore();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('/api/user/me');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setUser(userData); // This will also set the settings via userStore
      } catch (error) {

        showToast({
          title: 'Erro',
          content: 'Erro ao carregar dados do usuário',
          type: 'error',
        });
        console.error('Error fetching user data:', error);
      }
    }

    fetchUserData().then(r => r);
  }, [setUser, showToast]);
}