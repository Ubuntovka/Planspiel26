import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, AuthState } from '@/types/auth';

interface AuthStore extends AuthState {
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
}

// Create the auth store with persistence
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setToken: (token) => {
        if (typeof window !== 'undefined' && token) {
          localStorage.setItem('auth_token', token);
        } else if (typeof window !== 'undefined' && !token) {
          localStorage.removeItem('auth_token');
        }
        set({ token });
      },

      login: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token);
        }
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage', // localStorage key
      storage: typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined,
      partialize: (state: AuthStore) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

