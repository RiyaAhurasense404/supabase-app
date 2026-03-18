'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { handleRegister } from '@/lib/services/auth'
import { RegisterPayload } from '@/types/auth'

const INITIAL_STATE: RegisterPayload = { full_name: '', email: '', password: '' }

export default function RegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<RegisterPayload>(INITIAL_STATE)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await handleRegister(formData)
      toast.success('Registration successful!')
      router.push('/dashboard')
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
          <label htmlFor="full_name">Full Name</label>
          <br />
          <input
            id="full_name"
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Enter your full name"
            autoComplete="name"
            required
          />
        </div>
        <br />
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
            autoComplete="new-password"
            required
          />
        </div>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </>
  )
}