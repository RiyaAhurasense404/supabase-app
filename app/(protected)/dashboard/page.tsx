import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/queries/auth'
import LogoutButton from '@/components/dashboard/LogoutButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: user } = await getCurrentUser(supabase)

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.full_name}</p>
      <p>Email: {user?.email}</p>
      <LogoutButton />
    </div>
  )
}
