export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class AuthError extends AppError {
  constructor(message: string, code?: string) {
    super(message, code, 401)
    this.name = 'AuthError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'ValidationError'
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network request failed') {
    super(message, 'NETWORK_ERROR', 500)
    this.name = 'NetworkError'
  }
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  return 'An unexpected error occurred'
}

export const isAuthError = (error: unknown): error is AuthError => {
  return error instanceof AuthError
}

export const isValidationError = (error: unknown): error is ValidationError => {
  return error instanceof ValidationError
}

export const isNetworkError = (error: unknown): error is NetworkError => {
  return error instanceof NetworkError
}