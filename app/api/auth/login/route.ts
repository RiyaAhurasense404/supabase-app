import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'
import { validateLogin } from '@/lib/validations/login'
import { successResponse, errorResponse } from '@/lib/helpers/response'
import { LoginPayload } from '@/types/auth'

export async function POST(request: NextRequest) {
  try {
    const body: LoginPayload = await request.json()
    const { email, password } = body

    const validation = validateLogin(email, password)
    if (!validation.isValid) {
      return errorResponse('Validation failed', { errors: validation.errors }, 400)
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return errorResponse(error.message, {}, 400)
    }

    return successResponse('Login successful', { user: data.user }, 200)

  } catch {
    return errorResponse('Internal server error', {}, 500)
  }
}