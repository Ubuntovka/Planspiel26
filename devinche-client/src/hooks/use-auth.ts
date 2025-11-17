import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
import { authApi } from '@/api/auth';
import type { LoginCredentials, SignupCredentials, AuthResponse, User } from '@/types/auth';
import { useRouter } from 'next/navigation';

// Query keys for React Query
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

/**
 * Hook to get current authenticated user
 */
export const useCurrentUser = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { setUser, setToken } = useAuthStore();

  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const response = await authApi.getCurrentUser();
      setUser(response);
      return response;
    },
    enabled: isAuthenticated && !user, // Only fetch if authenticated but user not in store
    retry: false,
  });
};

/**
 * Hook for user login
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { login, setLoading } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data: AuthResponse) => {
      login(data.user, data.token);
      queryClient.setQueryData(authKeys.user(), data.user);
      router.push('/dashboard'); // Redirect after login
    },
    onError: (error: Error) => {
      console.error('Login error:', error);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

/**
 * Hook for user signup
 */
export const useSignup = () => {
  const queryClient = useQueryClient();
  const { login, setLoading } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: SignupCredentials) => authApi.signup(credentials),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data: AuthResponse) => {
      login(data.user, data.token);
      queryClient.setQueryData(authKeys.user(), data.user);
      router.push('/dashboard'); // Redirect after signup
    },
    onError: (error: Error) => {
      console.error('Signup error:', error);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

/**
 * Hook for user logout
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout();
      queryClient.clear(); // Clear all queries
      router.push('/login');
    },
    onError: () => {
      // Even if API call fails, logout locally
      logout();
      queryClient.clear();
      router.push('/login');
    },
  });
};

/**
 * Hook to check if user is authenticated
 */
export const useIsAuthenticated = () => {
  const { isAuthenticated, user } = useAuthStore();
  return { isAuthenticated, user };
};

