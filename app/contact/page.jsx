'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const supabase = createClient()
  const set = (k,v) => setForm(p=>({...p,[k]:v}))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all required fields'); return
    }
    setLoading(true)
    const { error } = await supabase.from('contacts').insert(form)
    setLoading(false)
    if (error) { toast.error('Something went wrong. Try again.'); return }
    setSent(true)
    toast.success('Message sent! We will reply within 24 hours 📬')
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-12">
      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl font-bold text-[#1B4D2E]">Get in Touch</h1>
        <p className="text-gray-500 mt-2">We would love to hear from you 🌿</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-5">Send a Message</h3>
          {sent ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-3">✅</div>
              <h3 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-2">Message Sent!</h3>
              <p className="text-gray-500 text-sm mb-4">We will reply within 24 hours.</p>
              <button onClick={() => { setSent(false); setForm({ name:'', email:'', subject:'', message:'' }) }}
                className="btn-outline text-sm">Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-[#1B4D2E] block mb-1">Name*</label>
                  <input value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Rahul Sharma" className="input-field" required />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#1B4D2E] block mb-1">Email*</label>
                  <input type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="rahul@email.com" className="input-field" required />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1B4D2E] block mb-1">Subject</label>
                <input value={form.subject} onChange={e=>set('subject',e.target.value)} placeholder="Product enquiry, health question..." className="input-field" />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1B4D2E] block mb-1">Message*</label>
                <textarea value={form.message} onChange={e=>set('message',e.target.value)}
                  placeholder="Your message here..." className="input-field" rows={4} required />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Sending...' : 'Send Message ✉️'}
              </button>
            </form>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-[#1B4D2E] rounded-2xl p-6 text-white">
            <h3 className="font-serif text-xl font-bold mb-4">Contact Info</h3>
            {[['📧','Email','pranorahealthofficial@gmail.com'],['💬','WhatsApp','Order or queries via WhatsApp'],['📺','YouTube','@pranorahealthofficial'],['📸','Instagram','@pranorahealth']].map(([icon,label,val]) => (
              <div key={label} className="flex items-center gap-3 mb-4">
                <span className="text-xl">{icon}</span>
                <div>
                  <div className="text-xs text-white/50">{label}</div>
                  <div className="text-sm font-semibold">{val}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <h4 className="font-serif text-xl font-bold text-[#1B4D2E] mb-4">FAQ</h4>
            {[['What are delivery timings?','We deliver within 5-7 business days across India.'],['Are products safe?','Yes, all products use natural Ayurvedic herbs with no harmful additives.'],['Can I return a product?','Yes, we offer a 30-day return policy on all products.'],['How to order via WhatsApp?','Send us a WhatsApp message with product name and your address.']].map(([q,a]) => (
              <div key={q} className="mb-4 last:mb-0">
                <div className="font-bold text-[#1B4D2E] text-sm mb-1">{q}</div>
                <div className="text-sm text-gray-500">{a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}