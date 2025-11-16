'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsAuthenticated } from '@/hooks/use-auth';
import { ROUTES } from '@/utils/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ children, redirectTo = ROUTES.LOGIN }: ProtectedRouteProps) {
  const { isAuthenticated } = useIsAuthenticated();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

