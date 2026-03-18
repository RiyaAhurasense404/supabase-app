import { createClient } from '@/lib/supabase/server'
import { User } from '@/types/auth'

export async function getUserProfile(userId: string): Promise<{ data: User | null; error: any }> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export async function updateUserProfile(userId: string, payload: Partial<User>): Promise<{ data: User | null; error: any }> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', userId)
    .select()
    .single()
  return { data, error }
}

export async function getCurrentUser(): Promise<{ data: User | null; error: any }> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return { data: null, error }
  return getUserProfile(user.id)
}

export async function loginQuery(email: string, password: string) {
  const supabase = await createClient()
  return await supabase.auth.signInWithPassword({ email, password })
}

export async function registerQuery(email: string, password: string, full_name: string) {
  const supabase = await createClient()
  return await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name } },
  })
}

export async function logoutQuery() {
  const supabase = await createClient()
  return await supabase.auth.signOut()
}