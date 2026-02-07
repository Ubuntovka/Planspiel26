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

// Update current user's profile
export type UpdateUserPayload = Partial<{
  email: string;
  password: string;
  oldPassword: string;
  firstName: string;
  lastName: string;
  username: string;
  pictureUrl: string | null;
  preferredLanguage: string;
}>;

export async function updateUser(
  token: string,
  payload: UpdateUserPayload
): Promise<{ user: ApiUser }> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/users/update`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as ErrorResponse).error || 'Update failed');
  }
  return data as { user: ApiUser };
}

// Delete current user's account
export async function deleteAccount(token: string): Promise<void> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/users/delete`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as ErrorResponse).error || 'Delete failed');
  }
}
