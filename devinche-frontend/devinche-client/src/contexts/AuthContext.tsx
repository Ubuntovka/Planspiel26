'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { getMe, logout as apiLogout, type ApiUser } from '@/features/auth-feature/api';

const AUTH_TOKEN_KEY = 'authToken';

interface AuthContextType {
  user: ApiUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  setSession: (token: string, user?: ApiUser) => void;
  logout: () => Promise<void>;
  getToken: () => string | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function readStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

function writeToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
    else localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const setSession = useCallback((newToken: string, newUser?: ApiUser) => {
    writeToken(newToken);
    setToken(newToken);
    if (newUser) setUser(newUser);
  }, []);

  const refreshUser = useCallback(async () => {
    const t = readStoredToken();
    if (!t) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }
    try {
      const u = await getMe(t);
      setToken(t);
      setUser(u);
    } catch {
      writeToken(null);
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    const t = token ?? readStoredToken();
    if (t) await apiLogout(t);
    writeToken(null);
    setToken(null);
    setUser(null);
  }, [token]);

  useEffect(() => {
    const t = readStoredToken();
    if (!t) {
      setToken(null);
      setUser(null);
      setLoading(false);
      return;
    }
    setToken(t);
    getMe(t)
      .then((u) => {
        setUser(u);
      })
      .catch(() => {
        writeToken(null);
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const value: AuthContextType = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    setSession,
    logout,
    getToken: () => token ?? readStoredToken(),
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
