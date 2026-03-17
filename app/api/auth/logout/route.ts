import { createClient } from '@/lib/supabase/server'
import { successResponse, errorResponse } from '@/lib/helpers/response'

export async function POST() {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      return errorResponse(error.message, {}, 400)
    }

    return successResponse('Logout successful', {}, 200)

  } catch {
    return errorResponse('Internal server error', {}, 500)
  }
}
