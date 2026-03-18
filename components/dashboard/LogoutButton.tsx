'use client'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { handleLogout } from '@/lib/services/auth'

export default function LogoutButton() {
  const router = useRouter()

  const onLogout = async () => {
    try {
      await handleLogout()
      toast.success('Logged out successfully!')
      router.push('/login')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message ?? 'Something went wrong')
    }
  }

  return (
    <>
      <Toaster position="top-right" />
      <button onClick={onLogout}>Logout</button>
    </>
  )
}