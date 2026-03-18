import { NextRequest } from 'next/server'
import { validateLogin } from '@/lib/validations/login'
import { successResponse, errorResponse } from '@/lib/helpers/response'
import { LoginPayload } from '@/types/auth'
import { handleAuthError } from '@/lib/helpers/errors'
import { loginQuery } from '@/lib/queries/auth'

export async function POST(request: NextRequest) {
  try {
    const body: LoginPayload = await request.json()
    const { email, password } = body

    const validation = validateLogin(email, password)
    if (!validation.isValid) {
      return errorResponse('Validation failed', { errors: validation.errors }, 400)
    }

    const { data, error } = await loginQuery(email, password) 

    if (error) {
      const { message, status } = handleAuthError(error)
      return errorResponse(message, {}, status)
    }

    return successResponse('Login successful', { user: data.user }, 200)
  } catch {
    return errorResponse('Internal server error', {}, 500)
  }
}