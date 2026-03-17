import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'
import { getDocumentById, deleteDocument } from '@/lib/queries/documents'
import { successResponse, errorResponse } from '@/lib/helpers/response'
import { handleAuthError, handleStorageError, handleDatabaseError, handleServerError } from '@/lib/helpers/errors'

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      const { message, status } = handleAuthError(authError)
      return errorResponse(message, {}, status)
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return errorResponse('Document id is required', {}, 400)
    }

    const { data: document, error: fetchError } = await getDocumentById(supabase, id)
    if (fetchError || !document) {
      const { message, status } = handleDatabaseError(fetchError)
      return errorResponse(message, {}, status)
    }

    if (document.user_id !== user.id) {
      return errorResponse('Unauthorized', {}, 401)
    }

    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([document.file_path])

    if (storageError) {
      const { message, status } = handleStorageError(storageError)
      return errorResponse(message, {}, status)
    }

    const { error: deleteError } = await deleteDocument(supabase, id)
    if (deleteError) {
      const { message, status } = handleDatabaseError(deleteError)
      return errorResponse(message, {}, status)
    }

    return successResponse('Document deleted successfully', {}, 200)

  } catch (error) {
    const { message, status } = handleServerError(error)
    return errorResponse(message, {}, status)
  }
}
