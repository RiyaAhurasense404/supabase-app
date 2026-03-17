import { SupabaseClient } from '@supabase/supabase-js'
import { User } from '@/types/auth'

export async function getUserProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<{ data: User | null; error: any }> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  return { data, error }
}

export async function updateUserProfile(
  supabase: SupabaseClient,
  userId: string,
  payload: Partial<User>
): Promise<{ data: User | null; error: any }> {
  const { data, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', userId)
    .select()
    .single()

  return { data, error }
}

export async function getCurrentUser(
  supabase: SupabaseClient
): Promise<{ data: User | null; error: any }> {
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) return { data: null, error }

  return getUserProfile(supabase, user.id)
}