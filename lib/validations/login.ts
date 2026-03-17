export type ValidationError = {
    field: string
    message: string
  }
  
  export type ValidationResult = {
    isValid: boolean
    errors: ValidationError[]
  }
  
  export function validateLogin(
    email: string,
    password: string
  ): ValidationResult {
    const errors: ValidationError[] = []
  
    if (!email || email.trim() === '') {
      errors.push({ field: 'email', message: 'Email is required' })
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email && !emailRegex.test(email)) {
      errors.push({ field: 'email', message: 'please enter valid email' })
    }
  
    if (!password || password.trim() === '') {
      errors.push({ field: 'password', message: 'Password is must' })
    }
  
    return {
      isValid: errors.length === 0,
      errors,
    }
  }