import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { validateRegister } from '@/lib/validations/register'
import { successResponse, errorResponse } from '@/lib/helpers/response'
import { RegisterPayload } from '@/types/auth'
import { handleAuthError, handleServerError } from '@/lib/helpers/errors'

export async function POST(request: NextRequest) {
  try {
    const body: RegisterPayload = await request.json()
    const { email, password, full_name } = body

    const validation = validateRegister(email, password, full_name)
    if (!validation.isValid) {
      return errorResponse('Validation failed', { errors: validation.errors }, 400)
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name },
      },
    })

    console.log('Supabase error:', error)
    console.log('Supabase data:', data)

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