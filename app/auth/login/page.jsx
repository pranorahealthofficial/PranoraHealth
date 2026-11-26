'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import TurnstileWidget from '@/components/TurnstileWidget'
import toast from 'react-hot-toast'

const TURNSTILE_ENABLED = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
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
    // The password is verified server-side (/api/auth/login), which also
    // enforces the per-email lockout: 5 failed attempts lock the email
    // for 5 hours. A locked account gets status 423 and the lock banner
    // below; wrong passwords still get the generic error as before.
    let res
    try {
      res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
    } catch {
      setLoading(false)
      toast.error('Incorrect email or password')
      return
    }
    const data = await res.json().catch(() => ({}))
    if (res.status === 423 && data?.error === 'locked') {
      setLoading(false)
      setIsLocked(true)
      setTurnstileToken('')
      setWidgetKey((k) => k + 1)
      return
    }
    if (res.status === 403 && data?.error === 'blocked') {
      setLoading(false)
      setIsBlocked(true)
      toast.error('Your account is blocked. To appeal, contact us.')
      return
    }
    if (!res.ok) {
      setLoading(false)
      setIsLocked(false)
      setTurnstileToken('')
      setWidgetKey((k) => k + 1)
      toast.error(res.status === 429 ? 'Too many attempts. Please try again later.' : 'Incorrect email or password')
      return
    }
    setLoading(false)
    toast.success('Welcome back! 🌿')
    const redirect = new URLSearchParams(window.location.search).get('redirect')
    // Full reload (not router.push): the session cookies were set by the
    // server login route, and a reload makes the auth state pick up the
    // new session before landing on the destination page.
    window.location.assign(redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/dashboard')
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
        {isLocked && (
          <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
            Too many failed login attempts. This email is locked for 5 hours.
            Forgot your password?{' '}
            <Link href="/auth/forgot-password" className="font-bold underline">Reset your password</Link>
            {' '}to unlock it right away.
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
      </div>
    </div>
  )
}
