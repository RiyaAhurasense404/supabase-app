import { NextRequest } from 'next/server'
import { deleteDocumentService } from '@/lib/services/documents.server'  
import { successResponse, errorResponse } from '@/lib/helpers/response'
import { handleServerError } from '@/lib/helpers/errors'

export async function DELETE(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get('id')
    if (!id) return errorResponse('Document id is required', {}, 400)

    const { error, message, status } = await deleteDocumentService(id)
    if (error) return errorResponse(message, {}, status)

    return successResponse('Document deleted successfully', {}, 200)
  } catch (error) {
    const { message, status } = handleServerError(error)
    return errorResponse(message, {}, status)
  }
}