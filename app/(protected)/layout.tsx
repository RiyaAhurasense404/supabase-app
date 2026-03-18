import { getCurrentUser } from '@/lib/queries/auth'
import { redirect } from 'next/navigation'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: user } = await getCurrentUser()
  if (!user) redirect('/login')

  return <>{children}</>
}