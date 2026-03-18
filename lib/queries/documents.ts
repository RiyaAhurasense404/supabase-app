import { createClient } from '@/lib/supabase/server'
import { Document, UploadPayload } from '@/types/document'

export async function getAllDocuments(): Promise<{ data: Document[] | null; error: any }> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error }
}

export async function getDocumentById(id: string): Promise<{ data: Document | null; error: any }> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single()
  return { data, error }
}

export async function saveDocument(payload: UploadPayload): Promise<{ data: Document | null; error: any }> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('documents')
    .insert(payload)
    .select()
    .single()
  return { data, error }
}

export async function deleteDocument(id: string): Promise<{ error: any }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id)
  return { error }
}

export async function getCurrentUser() {
  const supabase = await createClient()
  return await supabase.auth.getUser()
}

export async function deleteFromStorage(filePath: string) {
  const supabase = await createClient()
  return await supabase.storage
    .from('documents')
    .remove([filePath])
}