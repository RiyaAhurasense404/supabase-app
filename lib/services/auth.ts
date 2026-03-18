import { LoginPayload } from '@/types/auth'
import { RegisterPayload } from '@/types/auth'

export async function handleLogout(): Promise<void> {
    const response = await fetch('/api/auth/logout', { method: 'POST' })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message)
  }

export async function handleLogin(formData: LoginPayload): Promise<void> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message)
}

export async function handleRegister(formData: RegisterPayload): Promise<void> {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message)
}