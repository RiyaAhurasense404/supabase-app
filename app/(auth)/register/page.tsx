import RegisterForm from '@/components/auth/RegisterForm'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div>
      <h1>Register</h1>
      <RegisterForm />
      <p>
        Already account hai?{' '}
        <Link href="/login">Login karo</Link>
      </p>
    </div>
  )
}