import { getCurrentUser } from '@/lib/queries/auth'
import LogoutButton from '@/components/dashboard/LogoutButton'
import Link from 'next/link'

export default async function DashboardPage() {
  const { data: user } = await getCurrentUser()

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.full_name}</p>
      <p>Email: {user?.email}</p>
      <br />
      <Link href="/documents">Go to Documents</Link>
      <br /><br />
      <LogoutButton />
    </div>
  )
}