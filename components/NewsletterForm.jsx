'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const supabase = createClient()

  async function handleSubscribe(e) {
    e.preventDefault()
    if (!email || !email.includes('@')) { toast.error('Please enter a valid email'); return }
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
    <form onSubmit={handleSubscribe} className="flex gap-2">
      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com" className="input-field flex-1" required />
      <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
        {loading ? '...' : 'Subscribe'}
      </button>
    </form>
  )
}