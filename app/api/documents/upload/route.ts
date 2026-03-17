import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'
import { saveDocument } from '@/lib/queries/documents'
import { successResponse, errorResponse } from '@/lib/helpers/response'
import { handleDatabaseError, handleServerError } from '@/lib/helpers/errors'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return errorResponse('Unauthorized', {}, 401)
    }

    const body = await request.json()
    const { name, file_path, file_size, file_type } = body

    if (!name || !file_path || !file_size || !file_type) {
      return errorResponse('All fields are required', {}, 400)
    }

    const { data, error } = await saveDocument(supabase, {
      name,
      file_path,
      file_size,
      file_type,
      user_id: user.id,
    })

    if (error) {
      const { message, status } = handleDatabaseError(error)
      return errorResponse(message, {}, status)
    }

    return successResponse('Document uploaded successfully', { document: data }, 201)

  } catch {
    return errorResponse('Internal server error', {}, 500)
  }
}