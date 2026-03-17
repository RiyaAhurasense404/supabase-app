'use client'
import { useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { validateDocument } from '@/lib/validations/documents'
import { uploadToStorage } from '@/lib/storage/documents'

interface UploadButtonProps {
  userId: string
}

const supabase = createClient()

export default function UploadButton({ userId }: UploadButtonProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const saveMetadata = useCallback(async (file: File, filePath: string): Promise<boolean> => {
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

    if (!response.ok) {
      toast.error(data.message)
      return false
    }

    return true
  }, [])

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateDocument(file)
    if (!validation.isValid) {
      toast.error(validation.error!)
      return
    }

    setUploading(true)

    try {
      const { filePath, error: storageError } = await uploadToStorage(supabase, userId, file)
      if (storageError || !filePath) {
        toast.error(storageError ?? 'Upload failed')
        return
      }

      const saved = await saveMetadata(file, filePath)
      if (!saved) return

      toast.success('Document uploaded successfully!')
      router.refresh()

    } catch {
      toast.error('Something went wrong, please try again')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [userId, saveMetadata, router])

  return (
    <>
      <Toaster position="top-right" />
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        style={{ display: 'none' }}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
      >
        {uploading ? 'Uploading...' : 'Upload Document'}
      </button>
    </>
  )
}
