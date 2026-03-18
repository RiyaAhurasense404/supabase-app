'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { Document } from '@/types/document'
import { handleDownload, handleDelete } from '@/lib/services/documents.client'

interface DocumentListProps {
  documents: Document[]
}

export default function DocumentList({ documents }: DocumentListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const onDownload = async (document: Document) => {
    try {
      await handleDownload(document)
      toast.success('Document downloaded successfully!')
    } catch (error: any) {
      toast.error(error.message ?? 'Something went wrong')
    }
  }

  const onDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await handleDelete(id)
      toast.success('Document deleted successfully!')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message ?? 'Something went wrong')
    } finally {
      setDeletingId(null)
    }
  }

  if (documents.length === 0) return <p>No documents uploaded yet</p>

  return (
    <>
      <Toaster position="top-right" />
      <ul>
        {documents.map(doc => (
          <li key={doc.id}>
            <span>{doc.name}</span>
            <span> — {(doc.file_size / 1024).toFixed(2)} KB</span>
            <button onClick={() => onDownload(doc)}>Download</button>
            <button
              onClick={() => onDelete(doc.id)}
              disabled={deletingId === doc.id}
            >
              {deletingId === doc.id ? 'Deleting...' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}
