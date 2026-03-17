import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <LoginForm />
      <p>
        Don't have an account?{' '}
        <Link href="/register">Register here</Link>
      </p>
    </div>
  )
}