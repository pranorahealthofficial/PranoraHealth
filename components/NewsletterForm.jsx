'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import TurnstileWidget from '@/components/TurnstileWidget'
import toast from 'react-hot-toast'

const TURNSTILE_ENABLED = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [widgetKey, setWidgetKey] = useState(0)
  const supabase = createClient()

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

  async function handleSubscribe(e) {
    e.preventDefault()
    if (!email || !email.includes('@')) { toast.error('Please enter a valid email'); return }
    const captchaOk = await verifyTurnstile()
    if (!captchaOk) {
      setTurnstileToken('')
      setWidgetKey((k) => k + 1)
      toast.error('Something went wrong. Try again.')
      return
    }
    setLoading(true)
    const { error } = await supabase.from('newsletter_subscribers').insert({ email: email.toLowerCase() })
    setLoading(false)
    if (error?.code === '23505') { toast('You are already subscribed! 🌿'); return }
    if (error) { toast.error('Something went wrong. Try again.'); return }
    setDone(true)
    toast.success('Subscribed! Welcome to Pranora Health 🌿')
  }

  if (done) return (
    <div className="bg-[#e8f2eb] rounded-2xl p-6 text-center">
      <div className="text-4xl mb-2">✅</div>
      <div className="font-bold text-[#1B4D2E]">You are subscribed!</div>
      <div className="text-sm text-gray-500">Welcome to the Pranora Health community 🌿</div>
    </div>
  )

  return (
    <form onSubmit={handleSubscribe} className="flex gap-2 flex-wrap">
      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com" className="input-field flex-1" required />
      {TURNSTILE_ENABLED && (
        <TurnstileWidget key={widgetKey} onVerify={setTurnstileToken} />
      )}
      <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
        {loading ? '...' : 'Subscribe'}
      </button>
    </form>
  )
}
