/**
 * Auth API – all requests use the same API base (backend).
 * Use NEXT_PUBLIC_API_BASE_URL (e.g. http://localhost:4000) or leave empty for same-origin.
 */

const getApiBase = (): string => {
  if (typeof window === 'undefined') return '';
  return (process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/$/, '');
};

export interface ApiUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  pictureUrl?: string | null;
  preferredLanguage?: string;
  createdDate?: string;
  lastLoginDate?: string | null;
}

export interface AuthResponse {
  user: ApiUser;
  token: string;
}

export interface ErrorResponse {
  error: string;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as ErrorResponse).error || 'Login failed');
  }
  return data as AuthResponse;
}

export async function register(payload: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username?: string;
}): Promise<AuthResponse> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as ErrorResponse).error || 'Registration failed');
  }
  return data as AuthResponse;
}

export async function getMe(token: string): Promise<ApiUser> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/users/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as ErrorResponse).error || 'Session invalid');
  }
  return data as ApiUser;
}

export async function logout(token: string): Promise<void> {
  const base = getApiBase();
  try {
    await fetch(`${base}/api/users/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    // Ignore network errors on logout
  }
}

export { getApiBase };
