'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { downloadFromStorage } from '@/lib/storage/documents'
import { Document } from '@/types/document'

interface DocumentListProps {
  documents: Document[]
}

const supabase = createClient()

export default function DocumentList({ documents }: DocumentListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDownload = useCallback(async (document: Document) => {
    try {
      const { data, error } = await downloadFromStorage(supabase, document.file_path)

      if (error || !data) {
        toast.error(error ?? 'Download failed')
        return
      }

      const url = URL.createObjectURL(data)
      const link = window.document.createElement('a')
      link.href = url
      link.download = document.name
      link.click()
      URL.revokeObjectURL(url)

      toast.success('Document downloaded successfully!')

    } catch {
      toast.error('Something went wrong, please try again')
    }
  }, [])

  const handleDelete = useCallback(async (id: string) => {
    setDeletingId(id)

    try {
      const response = await fetch(`/api/documents/delete?id=${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message)
        return
      }

      toast.success('Document deleted successfully!')
      router.refresh()

    } catch {
      toast.error('Something went wrong, please try again')
    } finally {
      setDeletingId(null)
    }
  }, [router])

  if (documents.length === 0) {
    return <p>No documents uploaded yet</p>
  }

  return (
    <>
      <Toaster position="top-right" />
      <ul>
        {documents.map(doc => (
          <li key={doc.id}>
            <span>{doc.name}</span>
            <span> — {(doc.file_size / 1024).toFixed(2)} KB</span>

            <button
              onClick={() => handleDownload(doc)}
              style={{ cursor: 'pointer', marginLeft: '10px' }}
            >
              Download
            </button>

            <button
              onClick={() => handleDelete(doc.id)}
              disabled={deletingId === doc.id}
              style={{
                cursor: deletingId === doc.id ? 'not-allowed' : 'pointer',
                marginLeft: '10px'
              }}
            >
              {deletingId === doc.id ? 'Deleting...' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}
