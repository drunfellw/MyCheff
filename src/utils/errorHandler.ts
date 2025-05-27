import { AppError } from '../types';

// Error Types
export enum ErrorType {
  NETWORK = 'NETWORK_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTH_ERROR',
  PERMISSION = 'PERMISSION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR',
}

// Error Handler Class
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: AppError[] = [];

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Create standardized error
  createError(
    type: ErrorType,
    message: string,
    details?: any,
    code?: string
  ): AppError {
    const error: AppError = {
      code: code || type,
      message,
      details,
      timestamp: new Date(),
    };

    this.logError(error);
    return error;
  }

  // Log error for debugging
  private logError(error: AppError): void {
    this.errorLog.push(error);
    
    // In development, log to console
    if (__DEV__) {
      console.error('🚨 App Error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        timestamp: error.timestamp,
      });
    }

    // In production, send to crash reporting service
    // Example: Crashlytics.recordError(error);
  }

  // Handle network errors
  handleNetworkError(error: any): AppError {
    if (!error.response) {
      return this.createError(
        ErrorType.NETWORK,
        'Network connection failed. Please check your internet connection.',
        error
      );
    }

    const status = error.response.status;
    switch (status) {
      case 401:
        return this.createError(
          ErrorType.AUTHENTICATION,
          'Authentication failed. Please log in again.',
          error
        );
      case 403:
        return this.createError(
          ErrorType.PERMISSION,
          'You do not have permission to perform this action.',
          error
        );
      case 404:
        return this.createError(
          ErrorType.NOT_FOUND,
          'The requested resource was not found.',
          error
        );
      case 500:
        return this.createError(
          ErrorType.SERVER,
          'Server error occurred. Please try again later.',
          error
        );
      default:
        return this.createError(
          ErrorType.UNKNOWN,
          `Request failed with status ${status}`,
          error
        );
    }
  }

  // Handle validation errors
  handleValidationError(field: string, message: string): AppError {
    return this.createError(
      ErrorType.VALIDATION,
      `${field}: ${message}`,
      { field }
    );
  }

  // Get error logs (for debugging)
  getErrorLogs(): AppError[] {
    return [...this.errorLog];
  }

  // Clear error logs
  clearErrorLogs(): void {
    this.errorLog = [];
  }
}

// Utility functions
export const errorHandler = ErrorHandler.getInstance();

export const handleAsyncError = async <T>(
  asyncFn: () => Promise<T>,
  fallbackValue?: T
): Promise<T | undefined> => {
  try {
    return await asyncFn();
  } catch (error) {
    const appError = errorHandler.handleNetworkError(error);
    
    if (fallbackValue !== undefined) {
      return fallbackValue;
    }
    
    throw appError;
  }
};

// React Error Boundary Hook
export const useErrorHandler = () => {
  const handleError = (error: any, errorInfo?: any) => {
    const appError = errorHandler.createError(
      ErrorType.UNKNOWN,
      error.message || 'An unexpected error occurred',
      { error, errorInfo }
    );
    
    return appError;
  };

  return { handleError };
}; 