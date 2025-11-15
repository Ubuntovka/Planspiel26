import type { ApiError } from '@/types/api';

/**
 * Custom error class for API errors
 */
export class ApiException extends Error {
  status?: number;
  errors?: Record<string, string[]>;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'ApiException';
    this.status = error.status;
    this.errors = error.errors;
  }

  /**
   * Get first error message
   */
  getFirstError(): string {
    if (this.errors) {
      const firstKey = Object.keys(this.errors)[0];
      const firstError = this.errors[firstKey];
      if (firstError && firstError.length > 0) {
        return firstError[0];
      }
    }
    return this.message;
  }

  /**
   * Get all error messages as a flat array
   */
  getAllErrors(): string[] {
    const errors: string[] = [];
    if (this.errors) {
      Object.values(this.errors).forEach((errorArray) => {
        errors.push(...errorArray);
      });
    }
    if (errors.length === 0) {
      errors.push(this.message);
    }
    return errors;
  }
}

/**
 * Handle API errors and return user-friendly messages
 */
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiException) {
    return error.getFirstError();
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};

