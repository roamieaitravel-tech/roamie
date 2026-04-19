/**
 * Error handling and logging utilities
 */

export enum ErrorType {
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  NETWORK = 'NETWORK',
  UNKNOWN = 'UNKNOWN',
}

export class AppError extends Error {
  constructor(
    message: string,
    public type: ErrorType = ErrorType.UNKNOWN,
    public statusCode: number = 500,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Parse Supabase errors
export const parseSupabaseError = (error: unknown): AppError => {
  if (error instanceof Error) {
    const message = error.message;

    if (message.includes('JWT')) {
      return new AppError('Session expired. Please login again.', ErrorType.AUTHENTICATION, 401);
    }

    if (message.includes('duplicate')) {
      return new AppError('This email is already in use.', ErrorType.VALIDATION, 400);
    }

    if (message.includes('not found')) {
      return new AppError('Resource not found.', ErrorType.NOT_FOUND, 404);
    }

    if (message.includes('unauthorized')) {
      return new AppError('You do not have permission to perform this action.', ErrorType.AUTHORIZATION, 403);
    }

    return new AppError(message, ErrorType.SERVER, 500);
  }

  return new AppError('An unexpected error occurred.', ErrorType.UNKNOWN, 500);
};

// Parse API response errors
export const parseApiError = (response: Response | unknown): AppError => {
  if (response instanceof Response) {
    const status = response.status;

    if (status === 401) {
      return new AppError('Unauthorized. Please login again.', ErrorType.AUTHENTICATION, 401);
    }

    if (status === 403) {
      return new AppError('Access denied.', ErrorType.AUTHORIZATION, 403);
    }

    if (status === 404) {
      return new AppError('Resource not found.', ErrorType.NOT_FOUND, 404);
    }

    if (status >= 500) {
      return new AppError('Server error. Please try again later.', ErrorType.SERVER, status);
    }

    if (status >= 400) {
      return new AppError('Request error. Please check your input.', ErrorType.VALIDATION, status);
    }
  }

  return new AppError('An unexpected error occurred.', ErrorType.UNKNOWN, 500);
};

// User-friendly error messages
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred. Please try again.';
};

// Log errors for debugging
export const logError = (
  error: unknown,
  context: string,
  additionalData?: Record<string, unknown>
): void => {
  const errorData = {
    timestamp: new Date().toISOString(),
    context,
    message: getErrorMessage(error),
    additionalData,
  };

  if (process.env.NODE_ENV === 'development') {
    console.error('[ERROR]', errorData);
  }

  // In production, you could send this to a logging service like Sentry
  // sentry.captureException(error, { contexts: { custom: errorData } });
};

// Retry logic for failed requests
export const retryAsync = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: unknown;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }

  throw lastError;
};

// Safe JSON parse
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
};

// Safe async operation wrapper
export const safeAsync = async <T>(
  asyncFn: () => Promise<T>
): Promise<{ data: T | null; error: AppError | null }> => {
  try {
    const data = await asyncFn();
    return { data, error: null };
  } catch (error) {
    const appError = error instanceof AppError ? error : parseSupabaseError(error);
    return { data: null, error: appError };
  }
};
