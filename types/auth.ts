export type User = {
    id: string
    email: string
    full_name: string
    created_at: string
  }
  
  export type RegisterPayload = {
    email: string
    password: string
    full_name: string
  }
  
  export type LoginPayload = {
    email: string
    password: string
  }
  
  export type AuthResponse = {
    message?: string
    error?: string
    user?: User
  }