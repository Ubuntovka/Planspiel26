'use client';

import { useIsAuthenticated, useLogout } from '@/hooks/use-auth';
import { useCurrentUser } from '@/hooks/use-auth';

export function UserProfile() {
  const { user } = useIsAuthenticated();
  const logoutMutation = useLogout();
  const { data: currentUser, isLoading } = useCurrentUser();

  const displayUser = currentUser || user;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600" />
        <div className="h-4 w-24 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
      </div>
    );
  }

  if (!displayUser) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        {displayUser.name && (
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {displayUser.name}
          </p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">{displayUser.email}</p>
      </div>
      <button
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
        className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
}

