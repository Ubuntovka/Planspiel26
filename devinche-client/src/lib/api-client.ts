import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

// API Response wrapper type
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

// API Error type
export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// Create axios instance with default config
const createApiClient = (): AxiosInstance => {
  const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - Add auth token if available
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Get token from localStorage (client-side) or cookies (server-side)
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle errors globally
  apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      // Handle 401 Unauthorized - Clear token and redirect to login
      if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          // You can add redirect logic here if needed
          // window.location.href = '/login';
        }
      }

      // Transform error to our ApiError format
      const apiError: ApiError = {
        message: error.response?.data?.message || error.message || 'An error occurred',
        status: error.response?.status,
        errors: error.response?.data?.errors,
      };

      return Promise.reject(apiError);
    }
  );

  return apiClient;
};

// Create the default API client instance
export const apiClient = createApiClient();

// Custom fetcher function for TanStack Query
export const fetcher = async <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiClient.get<ApiResponse<T>>(url, config);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Custom mutation function for POST, PUT, DELETE requests
export const mutationFetcher = async <T = any, D = any>(
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    let response;
    switch (method) {
      case 'POST':
        response = await apiClient.post<ApiResponse<T>>(url, data, config);
        break;
      case 'PUT':
        response = await apiClient.put<ApiResponse<T>>(url, data, config);
        break;
      case 'PATCH':
        response = await apiClient.patch<ApiResponse<T>>(url, data, config);
        break;
      case 'DELETE':
        response = await apiClient.delete<ApiResponse<T>>(url, config);
        break;
    }
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Helper functions for common HTTP methods
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    fetcher<T>(url, config),
  
  post: <T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig) =>
    mutationFetcher<T, D>('POST', url, data, config),
  
  put: <T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig) =>
    mutationFetcher<T, D>('PUT', url, data, config),
  
  patch: <T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig) =>
    mutationFetcher<T, D>('PATCH', url, data, config),
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    mutationFetcher<T>('DELETE', url, undefined, config),
};

export default apiClient;

