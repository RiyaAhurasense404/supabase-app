import { getCurrentUser, getDocumentById, deleteDocument, deleteFromStorage, saveDocument } from '@/lib/queries/documents'
import { handleAuthError, handleStorageError, handleDatabaseError } from '@/lib/helpers/errors'
import { UploadPayload } from '@/types/document'

async function getAuthenticatedUser() {
  const { data: { user }, error } = await getCurrentUser()
  if (error || !user) {
    const { message, status } = handleAuthError(error)
    return { user: null, authError: { message, status } }
  }
  return { user, authError: null }
}

export async function deleteDocumentService(id: string) {
  const { user, authError } = await getAuthenticatedUser()
  if (authError) return { error: true, ...authError }

  const { data: document, error: fetchError } = await getDocumentById(id)
  if (fetchError || !document) {
    const { message, status } = handleDatabaseError(fetchError)
    return { error: true, message, status }
  }

  if (document.user_id !== user!.id) {
    return { error: true, message: 'Unauthorized', status: 401 }
  }

  const [{ error: storageError }, { error: deleteError }] = await Promise.all([
    deleteFromStorage(document.file_path),
    deleteDocument(id),
  ])

  if (storageError) {
    const { message, status } = handleStorageError(storageError)
    return { error: true, message, status }
  }

  if (deleteError) {
    const { message, status } = handleDatabaseError(deleteError)
    return { error: true, message, status }
  }

  return { error: false, message: '', status: 200 }
}

export async function uploadDocumentService(body: Partial<UploadPayload>) {
  const { user, authError } = await getAuthenticatedUser()
  if (authError) return { error: true, ...authError }

  const { name, file_path, file_size, file_type } = body
  if (!name || !file_path || !file_size || !file_type) {
    return { error: true, message: 'All fields are required', status: 400 }
  }

  const { data, error } = await saveDocument({ name, file_path, file_size, file_type, user_id: user!.id })
  if (error) {
    const { message, status } = handleDatabaseError(error)
    return { error: true, message, status }
  }

  return { error: false, message: '', status: 201, data }
}