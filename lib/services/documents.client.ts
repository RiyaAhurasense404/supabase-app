import { createClient } from '@/lib/supabase/client'
import { downloadFromStorage } from '@/lib/storage/documents'
import { Document } from '@/types/document'

const supabase = createClient()

export async function handleDownload(document: Document): Promise<void> {
  const { data, error } = await downloadFromStorage(supabase, document.file_path)
  if (error || !data) throw new Error(error ?? 'Download failed')

  const url = URL.createObjectURL(data)
  const link = window.document.createElement('a')
  link.href = url
  link.download = document.name
  link.click()
  URL.revokeObjectURL(url)
}

export async function handleDelete(id: string): Promise<void> {
  const response = await fetch(`/api/documents/delete?id=${id}`, { method: 'DELETE' })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message)
}