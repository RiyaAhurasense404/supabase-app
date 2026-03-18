import { successResponse, errorResponse } from '@/lib/helpers/response'
import { logoutQuery } from '@/lib/queries/auth'

export async function POST() {
  try {
    const { error } = await logoutQuery()

    if (error) {
      return errorResponse(error.message, {}, 400)
    }

    return successResponse('Logout successful', {}, 200)
  } catch {
    return errorResponse('Internal server error', {}, 500)
  }
}