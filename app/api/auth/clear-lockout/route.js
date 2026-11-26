import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { getClientIp, isRateLimited } from '@/lib/rate-limit'

// Clears the login lockout after a successful password reset. The email
// is taken from the caller's own recovery session, NEVER from the
// request body, so nobody can clear someone else's lock. Best-effort:
// if the lockout functions do not exist yet, this is a no-op and the
// password reset itself is unaffected.
//
// Rate limit: 10 requests per IP per 10 minutes. The limiter fails
// open, so a limiter error never blocks a legitimate reset.
const CLEAR_LIMIT = 10
const CLEAR_WINDOW_MS = 10 * 60 * 1000

export async function POST(request) {
  if (isRateLimited(`clear-lockout:${getClientIp(request)}`, CLEAR_LIMIT, CLEAR_WINDOW_MS)) {
    return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429, headers: { 'Retry-After': '600' } })
  }

  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) {
    return NextResponse.json({ error: 'Not logged in.' }, { status: 401 })
  }

  try {
    await supabase.rpc('clear_login_attempts', { p_email: user.email })
  } catch {
    // Best-effort: the reset already succeeded.
  }

  return NextResponse.json({ ok: true })
}
