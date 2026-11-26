'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase'
import TurnstileWidget from '@/components/TurnstileWidget'
import toast from 'react-hot-toast'

const TURNSTILE_ENABLED = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signOut } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [widgetKey, setWidgetKey] = useState(0)

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('error') === 'blocked') {
      setIsBlocked(true)
    }
  }, [])

  async function verifyTurnstile() {
    if (!TURNSTILE_ENABLED) return true
    if (!turnstileToken) return false
    try {
      const res = await fetch('/api/verify-turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: turnstileToken }),
      })
      const data = await res.json().catch(() => ({}))
      return data?.ok === true || data?.reason === 'not_configured'
    } catch {
      return false
    }
  }

  async function handleLogin(e) {
    e.preventDefault()
    if (!email || !password) { toast.error('Please fill all fields'); return }
    setLoading(true)
    const captchaOk = await verifyTurnstile()
    if (!captchaOk) {
      setLoading(false)
      setTurnstileToken('')
      setWidgetKey((k) => k + 1)
      toast.error('Incorrect email or password')
      return
    }
    const { data, error } = await signIn(email, password)
    if (error) { setLoading(false); toast.error('Incorrect email or password'); return }
    const userId = data?.user?.id
    if (userId) {
      const supabase = createClient()
      const { data: profile, error: profileError } = await supabase.from('profiles').select('is_blocked').eq('id', userId).single()
      // Fail-open: if the profile query itself errors, allow the login as today.
      if (!profileError && profile?.is_blocked) {
        await signOut()
        setLoading(false)
        setIsBlocked(true)
        toast.error('Your account is blocked. To appeal, contact us.')
        return
      }
    }
    setLoading(false)
    toast.success('Welcome back! 🌿')
    const redirect = new URLSearchParams(window.location.search).get('redirect')
    router.push(redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/dashboard')
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-7">
          <div className="text-4xl mb-2">🌿</div>
          <h1 className="font-serif text-3xl font-bold text-[#1B4D2E]">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">Login to your Pranora Health account</p>
        </div>
        {isBlocked && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            Your account is blocked. To appeal, <Link href="/contact" className="font-bold underline">contact us</Link>.
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-[#1B4D2E] block mb-1">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com" className="input-field" required />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#1B4D2E] block mb-1">Password</label>
            <div className="relative">
  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
    placeholder="••••••••" className="input-field pr-12" required />
  <button type="button" onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1B4D2E] text-xl">
    {showPassword ? '🙈' : '👁️'}
  </button>
</div>
          </div>
          <div className="text-right">
            <Link href="/auth/forgot-password" className="text-sm text-[#1B4D2E] hover:underline">Forgot password?</Link>
          </div>
          {TURNSTILE_ENABLED && (
            <TurnstileWidget key={widgetKey} onVerify={setTurnstileToken} />
          )}
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-5">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="font-bold text-[#1B4D2E] hover:underline">Register</Link>
        </p>
        <div className="border-t border-gray-100 mt-5 pt-4 text-center">
          <Link href="/admin" className="text-xs text-gray-400 hover:text-gray-600">Admin Panel →</Link>
        </div>
      </div>
    </div>
  )
}
