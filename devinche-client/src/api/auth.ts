import { api } from '@/lib/api-client';
import type { AuthResponse, LoginCredentials, SignupCredentials, User } from '@/types/auth';

// API endpoints
export const authApi = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return api.post<AuthResponse>('/auth/login', credentials);
  },

  // Signup user
  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    return api.post<AuthResponse>('/auth/signup', credentials);
  },

  // Logout user
  logout: async (): Promise<void> => {
    return api.post('/auth/logout');
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    return api.get<User>('/auth/me');
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    return api.post<AuthResponse>('/auth/refresh', { refreshToken });
  },

  // Update user profile
  updateProfile: async (data: Partial<User>): Promise<User> => {
    return api.patch<User>('/auth/profile', data);
  },

  // Change password
  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    return api.post('/auth/change-password', { oldPassword, newPassword });
  },
};

