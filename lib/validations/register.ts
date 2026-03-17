export type ValidationError = {
    field: string
    message: string
  }
  
  export type ValidationResult = {
    isValid: boolean
    errors: ValidationError[]
  }
  
  export function validateRegister(
    email: string,
    password: string,
    full_name: string
  ): ValidationResult {
    const errors: ValidationError[] = []
  
    if (!full_name || full_name.trim() === '') {
      errors.push({ field: 'full_name', message: 'Full name is required ' })
    }
  
    if (full_name && full_name.trim().length < 3) {
      errors.push({ field: 'full_name', message: 'Full name must contain atleast 4 character' })
    }
  
    if (!email || email.trim() === '') {
      errors.push({ field: 'email', message: 'Email is required' })
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email && !emailRegex.test(email)) {
      errors.push({ field: 'email', message: 'enter Valid email' })
    }
  
    if (!password || password.trim() === '') {
      errors.push({ field: 'password', message: 'Password is necessary' })
    }
  
    if (password && password.length < 8) {
      errors.push({ field: 'password', message: 'Password must be atleast 8 characters' })
    }
  
    if (password && !/[A-Z]/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain atleast 1 capital letter' })
    }
  
    if (password && !/[0-9]/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain atleast 1 number' })
    }
  
    return {
      isValid: errors.length === 0,
      errors,
    }
  }