import { SupabaseClient } from '@supabase/supabase-js'
import * as tus from 'tus-js-client'

const CHUNK_SIZE = 5 * 1024 * 1024 

export async function uploadToStorage(
  supabase: SupabaseClient,
  userId: string,
  file: File,
  onProgress?: (percent: number, chunk: number, total: number) => void
): Promise<{ filePath: string | null; error: string | null }> {
  console.log('3. uploadToStorage called:', file.name)
  const filePath = `${userId}/${Date.now()}_${file.name}`

  return new Promise(async (resolve) => {
    const { data: { session } } = await supabase.auth.getSession()
    console.log('3a. Session:', session ? 'exists' : 'NULL!') 

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE)

    const upload = new tus.Upload(file, {
      endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000, 20000], 
      chunkSize: CHUNK_SIZE,
      headers: {
        authorization: `Bearer ${session?.access_token}`,
        'x-upsert': 'true',
      },
      metadata: {
        bucketName: 'documents',
        objectName: filePath,
        contentType: file.type,
        cacheControl: '3600',
      },
      onProgress(bytesUploaded, bytesTotal) {
        const percent = Math.round((bytesUploaded / bytesTotal) * 100)
        const currentChunk = Math.ceil(bytesUploaded / CHUNK_SIZE)
        console.log(`Chunk ${currentChunk}/${totalChunks} — ${percent}%`)
        onProgress?.(percent, currentChunk, totalChunks)
      },
      onSuccess() {
        resolve({ filePath, error: null })
      },
      onError(error) {
        resolve({ filePath: null, error: error.message })
      },
    })

    const previousUploads = await upload.findPreviousUploads()
    if (previousUploads.length > 0) {
      upload.resumeFromPreviousUpload(previousUploads[0])
    }

    upload.start()
    console.log('3b. Upload started')
  })
}

export async function downloadFromStorage(
  supabase: SupabaseClient,
  filePath: string
): Promise<{ data: Blob | null; error: string | null }> {
  const { data, error } = await supabase.storage
    .from('documents')
    .download(filePath)

  if (error) return { data: null, error: error.message }
  return { data, error: null }
}