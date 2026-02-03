'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Where to redirect if not authenticated. Default: /login */
  redirectTo?: string;
  /** Optional: redirect path to append as returnUrl query (e.g. ?returnUrl=/editor) */
  appendReturnUrl?: boolean;
}

/**
 * Wraps content that requires authentication. Redirects to login if not authenticated.
 * Use in client pages or layouts for /editor, /validation-rules, etc.
 */
export default function ProtectedRoute({
  children,
  redirectTo = '/login',
  appendReturnUrl = true,
}: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      const url = appendReturnUrl && pathname
        ? `${redirectTo}?returnUrl=${encodeURIComponent(pathname)}`
        : redirectTo;
      router.replace(url);
    }
  }, [loading, isAuthenticated, router, redirectTo, pathname, appendReturnUrl]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--editor-bg,#e8eaed)]">
        <div className="text-[var(--editor-text,#111)]">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
