import { NextRequest } from 'next/server'
import { uploadDocumentService } from '@/lib/services/documents.server' 
import { successResponse, errorResponse } from '@/lib/helpers/response'
import { handleServerError } from '@/lib/helpers/errors'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { error, message, status, data } = await uploadDocumentService(body)

    if (error) return errorResponse(message, {}, status)
    return successResponse('Document uploaded successfully', { document: data }, 201)
  } catch (error) {
    const { message, status } = handleServerError(error)
    return errorResponse(message, {}, status)
  }
}