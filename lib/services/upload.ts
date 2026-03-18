import { createClient } from '@/lib/supabase/client'
import { validateDocument } from '@/lib/validations/documents'
import { uploadToStorage } from '@/lib/storage/documents'

const supabase = createClient()

type ProgressCallback = (percent: number, chunk: number, total: number) => void

export async function handleUpload(
  file: File,
  userId: string,
  onProgress?: ProgressCallback
): Promise<void> {
  const validation = validateDocument(file)
  if (!validation.isValid) throw new Error(validation.error!)

  const { filePath, error: storageError } = await uploadToStorage(
    supabase, userId, file, onProgress
  )
  if (storageError || !filePath) throw new Error(storageError ?? 'Upload failed')

  const response = await fetch('/api/documents/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: file.name,
      file_path: filePath,
      file_size: file.size,
      file_type: file.type,
    }),
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.message)
}