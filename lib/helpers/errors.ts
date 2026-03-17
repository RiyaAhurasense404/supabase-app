export type AppError = {
    message: string
    status: number
  }
  
  export function handleAuthError(error: any): AppError {
    if (error?.status === 429) {
      return { message: 'Too many attempts, please try again later', status: 429 }
    }
    if (error?.status === 400) {
      return { message: 'Invalid credentials', status: 400 }
    }
    if (error?.status === 422) {
      return { message: 'Invalid email or password format', status: 422 }
    }
    return { message: error?.message || 'Authentication failed', status: 400 }
  }
  
  export function handleStorageError(error: any): AppError {
    if (error?.statusCode === '404') {
      return { message: 'File not found', status: 404 }
    }
    if (error?.statusCode === '403') {
      return { message: 'You do not have permission to access this file', status: 403 }
    }
    if (error?.statusCode === '413') {
      return { message: 'File size too large', status: 413 }
    }
    return { message: error?.message || 'Storage operation failed', status: 400 }
  }
  
  export function handleDatabaseError(error: any): AppError {
    if (error?.code === '23505') {
      return { message: 'Record already exists', status: 409 }
    }
    if (error?.code === '23503') {
      return { message: 'Referenced record not found', status: 404 }
    }
    if (error?.code === 'PGRST116') {
      return { message: 'Record not found', status: 404 }
    }
    return { message: error?.message || 'Database operation failed', status: 400 }
  }
  
  export function handleServerError(error: any): AppError {
    console.error('Server error:', error)
    return { message: 'Internal server error', status: 500 }
  }