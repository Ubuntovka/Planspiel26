// User type
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Authentication response type
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Signup credentials
export interface SignupCredentials {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
}

// Auth state type
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

