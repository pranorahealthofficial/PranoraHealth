'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  async function handleLogin(e) {
    e.preventDefault()
    if (!email || !password) { toast.error('Please fill all fields'); return }
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) { toast.error('Incorrect email or password'); return }
    toast.success('Welcome back! 🌿')
    router.push(searchParams.get('redirect') || '/dashboard')
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-7">
          <div className="text-4xl mb-2">🌿</div>
          <h1 className="font-serif text-3xl font-bold text-[#1B4D2E]">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">Login to your Pranora Health account</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-[#1B4D2E] block mb-1">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com" className="input-field" required />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#1B4D2E] block mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" className="input-field" required />
          </div>
          <div className="text-right">
            <Link href="/auth/forgot-password" className="text-sm text-[#1B4D2E] hover:underline">Forgot password?</Link>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-5">
          Don't have an account?{' '}
          <Link href="/auth/register" className="font-bold text-[#1B4D2E] hover:underline">Register</Link>
        </p>
        <div className="border-t border-gray-100 mt-5 pt-4 text-center">
          <Link href="/admin" className="text-xs text-gray-400 hover:text-gray-600">Admin Panel →</Link>
        </div>
      </div>
    </div>
  )
}