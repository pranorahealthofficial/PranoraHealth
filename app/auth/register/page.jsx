'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  async function handleRegister(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill all required fields'); return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters'); return
    }
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match'); return
    }
    setLoading(true)
    const { error } = await signUp(form.email, form.password, form.name, form.phone)
    setLoading(false)
    if (error) { toast.error(error.message); return }
    toast.success('Account created! Welcome to Pranora Health 🌿')
    router.push('/dashboard')
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-7">
          <div className="text-4xl mb-2">🌿</div>
          <h1 className="font-serif text-3xl font-bold text-[#1B4D2E]">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join the Pranora Health community</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-[#1B4D2E] block mb-1">Full Name*</label>
              <input value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="Rahul Sharma" className="input-field" required />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#1B4D2E] block mb-1">Phone</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)}
                placeholder="9876543210" className="input-field" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-[#1B4D2E] block mb-1">Email Address*</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
              placeholder="your@email.com" className="input-field" required />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#1B4D2E] block mb-1">Password*</label>
            <input type="password" value={form.password} onChange={e => set('password', e.target.value)}
              placeholder="Min. 6 characters" className="input-field" required />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#1B4D2E] block mb-1">Confirm Password*</label>
            <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)}
              placeholder="Repeat password" className="input-field" required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-bold text-[#1B4D2E] hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}