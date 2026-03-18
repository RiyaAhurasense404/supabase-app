'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { handleLogin } from '@/lib/services/auth'
import { LoginPayload } from '@/types/auth'

const INITIAL_STATE: LoginPayload = { email: '', password: '' }

export default function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<LoginPayload>(INITIAL_STATE)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await handleLogin(formData)
      toast.success('Login successful!')
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <br />
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
        </div>
        <br />
        <div>
          <label htmlFor="password">Password</label>
          <br />
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
        </div>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </>
  )
}