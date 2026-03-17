'use client'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message)
        return
      }

      toast.success('Logged out successfully!')
      router.push('/login')
      router.refresh()

    } catch {
      toast.error('Something went wrong, please try again')
    }
  }

  return (
    <>
      <Toaster position="top-right" />
      <button onClick={handleLogout}>
        Logout
      </button>
    </>
  )
}