// store/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserDataSettings } from '@/app/types/User';

interface UserState {
  user: User | null;
  settings: UserDataSettings | null;
  setUser: (user: User) => void;
  setSettings: (settings: UserDataSettings) => void;
  updateSettings: (settings: Partial<UserDataSettings>) => void;
  clearUser: () => void;
  getUser: () => User | null;
  getSettings: () => UserDataSettings | null;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      settings: null,
      setUser: (user: User) =>
        set({
          user,
          settings: user.settings
        }),
      setSettings: (settings: UserDataSettings) =>
        set((state) => ({
          settings,
          user: state.user ? { ...state.user, settings } : null,
        })),
      updateSettings: (partialSettings: Partial<UserDataSettings>) =>
        set((state) => {
          if (!state.settings) return state;

          const newSettings = {
            ...state.settings,
            ...partialSettings,
          };

          return {
            settings: newSettings,
            user: state.user ? { ...state.user, settings: newSettings } : null,
          };
        }),
      clearUser: () => set({ user: null, settings: null }),
      getUser: () => get().user,
      getSettings: () => get().settings,
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        settings: state.settings,
        user: state.user ? {
          id: state.user.tenantId,
          name: state.user.name,
          email: state.user.email,
          image: state.user.image,
          roles: state.user.roles,
          notifications: state.user.notifications,
          settings: state.user.settings,
        } : null,
      }),
    }
  )
);