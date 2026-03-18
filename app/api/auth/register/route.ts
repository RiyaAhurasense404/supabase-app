import { NextRequest } from 'next/server'
import { validateRegister } from '@/lib/validations/register'
import { successResponse, errorResponse } from '@/lib/helpers/response'
import { RegisterPayload } from '@/types/auth'
import { handleAuthError } from '@/lib/helpers/errors'
import { registerQuery } from '@/lib/queries/auth'

export async function POST(request: NextRequest) {
  try {
    const body: RegisterPayload = await request.json()
    const { email, password, full_name } = body

    const validation = validateRegister(email, password, full_name)
    if (!validation.isValid) {
      return errorResponse('Validation failed', { errors: validation.errors }, 400)
    }

    const { data, error } = await registerQuery(email, password, full_name)

    if (error) {
      const { message, status } = handleAuthError(error)
      return errorResponse(message, {}, status)
    }

    if (data.user?.identities?.length === 0) {
      return errorResponse('Email already registered', {}, 400)
    }

    return successResponse('Registration successful', { user: data.user }, 201)
  } catch {
    return errorResponse('Internal server error', {}, 500)
  }
}