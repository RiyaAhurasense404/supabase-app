import { SupabaseClient } from '@supabase/supabase-js'

export async function uploadToStorage(
  supabase: SupabaseClient,
  userId: string,
  file: File
): Promise<{ filePath: string | null; error: string | null }> {
  const filePath = `${userId}/${Date.now()}_${file.name}`

  const { error } = await supabase.storage
    .from('documents')
    .upload(filePath, file)

  if (error) {
    return { filePath: null, error: error.message }
  }

  return { filePath, error: null }
}

export async function downloadFromStorage(
  supabase: SupabaseClient,
  filePath: string
): Promise<{ data: Blob | null; error: string | null }> {
  const { data, error } = await supabase.storage
    .from('documents')
    .download(filePath)

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

export async function deleteFromStorage(
  supabase: SupabaseClient,
  filePath: string
): Promise<{ error: string | null }> {
  const { error } = await supabase.storage
    .from('documents')
    .remove([filePath])

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}
