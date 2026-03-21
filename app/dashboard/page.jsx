'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  confirmed: 'bg-amber-100 text-amber-800',
  packed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-sky-100 text-sky-800',
  'out for delivery': 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-700'
}

export default function DashboardPage() {
  const { user, profile, signOut, loading } = useAuth()
  const [tab, setTab] = useState('profile')
  const [orders, setOrders] = useState([])
  const [saved, setSaved] = useState([])
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
    if (user) {
      supabase.from('orders').select('*, order_items(*)')
        .eq('user_id', user.id).order('created_at', { ascending: false })
        .then(({ data }) => setOrders(data || []))
      supabase.from('saved_articles').select('*, articles(*)')
        .eq('user_id', user.id)
        .then(({ data }) => setSaved(data?.map(s => s.articles) || []))
    }
  }, [user, loading])

  async function handleSignOut() {
    await signOut()
    toast('Logged out successfully')
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-4xl animate-spin">🌿</div>
    </div>
  )
  if (!user) return null

  const tabs = [
    ['profile', '👤 Profile'],
    ['orders', `📦 Orders (${orders.length})`],
    ['saved', `🔖 Saved (${saved.length})`]
  ]

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-3">
        <h1 className="font-serif text-4xl font-bold text-[#1B4D2E]">My Dashboard</h1>
        <button onClick={handleSignOut} className="btn-danger text-sm">Logout</button>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        {tabs.map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-5 py-2 rounded-full border-2 text-sm font-semibold transition-all ${tab === k ? 'bg-[#1B4D2E] text-white border-[#1B4D2E]' : 'bg-white text-gray-600 border-[#e8ddd0]'}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="card">
          <div className="flex gap-5 items-center mb-6 flex-wrap">
            <div className="w-16 h-16 bg-[#1B4D2E] rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
              {profile?.full_name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1B4D2E]">{profile?.full_name || 'User'}</h2>
              <div className="text-gray-500 text-sm">{user.email}</div>
              {profile?.phone && <div className="text-gray-500 text-sm">📞 {profile.phone}</div>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[[orders.length, '📦', 'Total Orders', '#fff8e1'], [saved.length, '🔖', 'Saved Articles', '#e8f5e9']].map(([n, icon, label, bg]) => (
              <div key={label} className="rounded-2xl p-5 text-center" style={{ background: bg }}>
                <div className="text-2xl mb-1">{icon}</div>
                <div className="font-serif text-3xl font-bold text-[#1B4D2E]">{n}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">📦</div>
              <p className="text-lg mb-4">No orders yet</p>
              <Link href="/products" className="btn-primary">Shop Now</Link>
            </div>
          ) : orders.map(order => (
            <div key={order.id} className="card">
              <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                <div>
                  <div className="font-bold text-[#1B4D2E]">Order #{order.id.slice(-8).toUpperCase()}</div>
                  <div className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[order.order_status] || 'bg-gray-100 text-gray-600'}`}>
                  {order.order_status}
                </span>
              </div>
              {order.order_items?.map(i => (
                <div key={i.id} className="text-sm text-gray-600 mb-1">
                  {i.product_icon} {i.product_name} ×{i.quantity} — ₹{i.subtotal.toLocaleString('en-IN')}
                </div>
              ))}
              <div className="font-bold text-[#1B4D2E] mt-2">Total: ₹{order.total.toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'saved' && (
        saved.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">🔖</div>
            <p className="text-lg mb-4">No saved articles yet</p>
            <Link href="/blog" className="btn-primary">Read Articles</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {saved.map(a => a && (
              <Link key={a.id} href={`/blog/${a.slug}`} className="bg-white rounded-2xl overflow-hidden shadow-md hover:-translate-y-1 transition-all">
                <div className="h-28 flex items-center justify-center text-4xl" style={{ background: a.color }}>{a.icon}</div>
                <div className="p-4">
                  <span className="badge-green text-xs mb-1 inline-block">{a.category}</span>
                  <p className="font-serif font-bold text-[#1B4D2E] text-sm line-clamp-2">{a.title}</p>
                </div>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  )
}