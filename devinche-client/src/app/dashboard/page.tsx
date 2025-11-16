'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { useIsAuthenticated, useLogout } from '@/hooks/use-auth';
import { useCurrentUser } from '@/hooks/use-auth';

export default function DashboardPage() {
  const { user } = useIsAuthenticated();
  const logoutMutation = useLogout();
  const { data: currentUser, isLoading } = useCurrentUser();

  const displayUser = currentUser || user;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <nav className="bg-white shadow dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Dashboard
                </h1>
              </div>
              <div className="flex items-center gap-4">
                {displayUser && (
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {displayUser.email}
                  </span>
                )}
                <button
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Welcome to your Dashboard!
            </h2>
            {isLoading ? (
              <p className="text-gray-600 dark:text-gray-400">Loading user data...</p>
            ) : displayUser ? (
              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> {displayUser.email}
                </p>
                {displayUser.name && (
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Name:</strong> {displayUser.name}
                  </p>
                )}
                {displayUser.id && (
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>User ID:</strong> {displayUser.id}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No user data available</p>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

