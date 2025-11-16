import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api';

/**
 * Generic hook for GET requests
 */
export function useApiQuery<TData = any>(
  queryKey: readonly unknown[],
  url: string,
  options?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData>({
    queryKey,
    queryFn: () => api.get<TData>(url),
    ...options,
  });
}

/**
 * Generic hook for POST requests
 */
export function useApiMutation<TData = any, TVariables = any>(
  url: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationFn: (data: TVariables) => {
      switch (method) {
        case 'POST':
          return api.post<TData, TVariables>(url, data);
        case 'PUT':
          return api.put<TData, TVariables>(url, data);
        case 'PATCH':
          return api.patch<TData, TVariables>(url, data);
        case 'DELETE':
          return api.delete<TData>(url);
        default:
          return api.post<TData, TVariables>(url, data);
      }
    },
    ...options,
  });
}

/**
 * Hook to invalidate queries
 */
export function useInvalidateQueries() {
  const queryClient = useQueryClient();

  return {
    invalidate: (queryKey: readonly unknown[]) => {
      return queryClient.invalidateQueries({ queryKey });
    },
    invalidateAll: () => {
      return queryClient.invalidateQueries();
    },
  };
}

