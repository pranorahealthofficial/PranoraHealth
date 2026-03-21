'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  async function handleReset(e) {
    e.preventDefault()
    if (!email) { toast.error('Please enter your email'); return }
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    setLoading(false)
    if (error) { toast.error(error.message); return }
    setSent(true)
  }

  if (sent) return (
    <div className="min-h-[60vh] flex items-center justify-center px-5">
      <div className="text-center">
        <div className="text-5xl mb-4">📧</div>
        <h2 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-2">Check your email!</h2>
        <p className="text-gray-500 mb-4">We sent a password reset link to <strong>{email}</strong></p>
        <Link href="/auth/login" className="btn-primary">Back to Login</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-5">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🔑</div>
          <h1 className="font-serif text-2xl font-bold text-[#1B4D2E]">Reset Password</h1>
          <p className="text-gray-500 text-sm mt-1">Enter your email to receive a reset link</p>
        </div>
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-[#1B4D2E] block mb-1">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com" className="input-field" required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <div className="text-center mt-4">
          <Link href="/auth/login" className="text-sm text-gray-500 hover:underline">← Back to Login</Link>
        </div>
      </div>
    </div>
  )
}