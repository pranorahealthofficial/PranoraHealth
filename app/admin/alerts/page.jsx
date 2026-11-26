'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

// Admin-only security alerts view. Shows the 3 recorded event types:
// failed logins, blocked-account attempts, and new admin grants.
// Reads the security_events table, which only exists after the SQL
// draft is applied in Supabase. Until then this page shows a setup
// message instead of events — it never crashes and never blocks the
// rest of the admin area. No email is sent by this page; email alerts
// need a separate provider + key (see the setup note below).

const LABELS = {
  failed_login: ['🔐 Failed login', 'bg-red-100 text-red-700'],
  blocked_attempt: ['🚫 Blocked-account attempt', 'bg-orange-100 text-orange-700'],
  admin_grant: ['👑 New admin grant', 'bg-yellow-100 text-yellow-800'],
}

const SPIKE_WINDOW_MS = 15 * 60 * 1000
const SPIKE_THRESHOLD = 5

function shortId(id) {
  return id ? String(id).slice(0, 8) : '—'
}

export default function SecurityAlertsPage() {
  const { user, isAdmin, loading, signOut } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [events, setEvents] = useState([])
  const [setupNeeded, setSetupNeeded] = useState(false)
  const [loadingEvents, setLoadingEvents] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user) { router.push('/auth/login'); return }
      if (!isAdmin) { router.push('/'); toast.error('Admin access required'); return }
      loadEvents()
    }
  }, [user, isAdmin, loading])

  async function loadEvents() {
    setLoadingEvents(true)
    const { data, error } = await supabase
      .from('security_events')
      .select('id, event_type, detail, actor_id, target_id, created_at')
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) {
      // Table/function missing (SQL draft not applied) or no access:
      // show the setup message, not an error crash.
      setSetupNeeded(true)
      setEvents([])
    } else {
      setSetupNeeded(false)
      setEvents(data || [])
    }
    setLoadingEvents(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-4xl animate-spin">🌿</div></div>

  const now = Date.now()
  const recentFailures = events.filter(e =>
    e.event_type === 'failed_login' && (now - new Date(e.created_at).getTime()) < SPIKE_WINDOW_MS
  ).length
  const counts = events.reduce((acc, e) => {
    acc[e.event_type] = (acc[e.event_type] || 0) + 1
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#1B4D2E] h-14 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <span className="text-xl">🌿</span>
          <span className="font-serif text-lg font-bold text-white">Pranora Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/70 text-sm hidden sm:block">{user?.email}</span>
          <Link href="/admin" className="text-white/80 text-xs border border-white/30 px-3 py-1 rounded-full hover:bg-white/10">Back to Admin</Link>
          <button onClick={() => { signOut(); router.push('/') }} className="bg-red-500 text-white text-xs px-3 py-1 rounded-full hover:bg-red-600">Logout</button>
        </div>
      </div>
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-1">Security Alerts</h2>
        <p className="text-sm text-gray-500 mb-5">Latest 50 recorded events. No passwords, emails, or IP addresses are stored.</p>

        {recentFailures >= SPIKE_THRESHOLD && (
          <div className="mb-5 rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-sm text-red-700">
            <span className="font-bold">Possible failed-login spike:</span> {recentFailures} failed logins in the last 15 minutes. Check whether someone is guessing passwords, and consider the password-reset suggestion on the login page.
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-6">
          {Object.keys(LABELS).map(type => (
            <div key={type} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="font-serif text-2xl font-bold text-[#1B4D2E]">{counts[type] || 0}</div>
              <div className="text-xs text-gray-500">{LABELS[type][0]}</div>
            </div>
          ))}
        </div>

        <div className="mb-6 rounded-2xl bg-yellow-50 border border-yellow-200 px-5 py-4 text-sm text-yellow-800">
          <span className="font-bold">Email alerts are not set up yet.</span> Events appear on this page only.
          Email delivery needs a free Resend account and its API key added in Vercel — it is not part of this change.
        </div>

        {setupNeeded ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm text-sm text-gray-600">
            <p className="font-bold text-[#1B4D2E] mb-2">Alerts table not set up yet.</p>
            <p>Run the security-events SQL draft in the Supabase SQL Editor first, then reload this page. Until then, no events are recorded and nothing here is broken.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
              <h3 className="font-bold text-[#1B4D2E]">Recent events</h3>
              <button onClick={loadEvents} className="btn-primary text-sm">Refresh</button>
            </div>
            {loadingEvents ? (
              <p className="px-5 py-4 text-sm text-gray-500">Loading…</p>
            ) : events.length === 0 ? (
              <p className="px-5 py-4 text-sm text-gray-500">No events recorded yet.</p>
            ) : (
              events.map(e => (
                <div key={e.id} className="flex justify-between items-center px-5 py-3 border-b border-gray-100 last:border-0 text-sm flex-wrap gap-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${LABELS[e.event_type]?.[1] || 'bg-gray-100 text-gray-600'}`}>
                    {LABELS[e.event_type]?.[0] || e.event_type}
                  </span>
                  <span className="text-gray-500">{e.detail || ''}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(e.created_at).toLocaleString('en-IN')}
                    {e.actor_id ? ` · by ${shortId(e.actor_id)}` : ''}
                    {e.target_id ? ` · user ${shortId(e.target_id)}` : ''}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
