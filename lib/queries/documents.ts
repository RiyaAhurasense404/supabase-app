import { SupabaseClient } from '@supabase/supabase-js'
import { Document, UploadPayload } from '@/types/document'

export async function getAllDocuments(
  supabase: SupabaseClient
): Promise<{ data: Document[] | null; error: any }> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function getDocumentById(
  supabase: SupabaseClient,
  id: string
): Promise<{ data: Document | null; error: any }> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single()

  return { data, error }
}

export async function saveDocument(
  supabase: SupabaseClient,
  payload: UploadPayload
): Promise<{ data: Document | null; error: any }> {
  const { data, error } = await supabase
    .from('documents')
    .insert(payload)
    .select()
    .single()

  return { data, error }
}

export async function deleteDocument(
  supabase: SupabaseClient,
  id: string
): Promise<{ error: any }> {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id)

  return { error }
}
