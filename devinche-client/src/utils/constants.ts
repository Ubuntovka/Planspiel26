// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  TIMEOUT: 30000,
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  AUTH_STORAGE: 'auth-storage',
} as const;

// Query Keys (for React Query)
export const QUERY_KEYS = {
  AUTH: {
    ALL: ['auth'] as const,
    USER: () => [...QUERY_KEYS.AUTH.ALL, 'user'] as const,
  },
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
} as const;

