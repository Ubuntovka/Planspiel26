'use client';

import { useAuth } from '@/contexts/AuthContext';
import type { ApiUser } from '@/features/auth-feature/api';

export { useAuth } from '@/contexts/AuthContext';

export type { ApiUser };

/**
 * Returns the logged-in user's token and profile info.
 * Use this when you only need token + user data (e.g. for API calls or display).
 */
export function useLoggedUser(): {
  token: string | null;
  user: ApiUser | null;
  isAuthenticated: boolean;
  loading: boolean;
} {
  const { token, user, isAuthenticated, loading } = useAuth();
  return {
    token,
    user,
    isAuthenticated,
    loading,
  };
}
