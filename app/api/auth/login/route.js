import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { getClientIp, isRateLimited } from '@/lib/rate-limit'

// Server-side login with per-email lockout (Nishant's spec, 26 Nov 2026):
// 5 failed password attempts for one email -> that email is locked for
// 5 hours. The lock is checked BEFORE the password is verified, so
// attempts made while locked never reach Supabase Auth.
//
// Lock state lives in public.login_attempts, touched ONLY through the
// SECURITY DEFINER functions in the SQL draft
// (hidden_files/login-lockout-draft-2026-11-26.sql). No service_role
// key is used anywhere. Every lockout RPC below fails OPEN: if the
// functions do not exist yet (SQL draft not applied), the lock check
// reports "not locked" and login works exactly as before, so the
// lockout simply stays dormant until the SQL is applied.
//
// Rate limit: 30 login attempts per IP per 10 minutes. The limiter
// fails open, so a limiter error never blocks a legitimate login.
const LOGIN_LIMIT = 30
const LOGIN_WINDOW_MS = 10 * 60 * 1000

const LOCKED_STATUS = 423

export async function POST(request) {
  if (isRateLimited(`auth-login:${getClientIp(request)}`, LOGIN_LIMIT, LOGIN_WINDOW_MS)) {
    return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429, headers: { 'Retry-After': '600' } })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body?.password === 'string' ? body.password : ''
  if (!email || !password) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()

  // 1. Lock check first. RPC errors fail open (functions not applied yet).
  try {
    const { data: lockedUntil, error: lockError } = await supabase.rpc('check_login_lockout', { p_email: email })
    if (!lockError && lockedUntil && new Date(lockedUntil).getTime() > Date.now()) {
      return NextResponse.json({ error: 'locked', lockedUntil }, { status: LOCKED_STATUS })
    }
  } catch {
    // Fail open: proceed as if not locked.
  }

  // 2. Verify the password server-side. The session cookies are set on
  // this response by the SSR client, which is what keeps the user
  // logged in after the login page reloads.
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data?.user) {
    // 3. Record the failure. If this was the 5th failure the function
    // returns the lock expiry and the account is now locked.
    try {
      const { data: lockedUntil, error: recordError } = await supabase.rpc('record_failed_login', { p_email: email })
      if (!recordError && lockedUntil) {
        return NextResponse.json({ error: 'locked', lockedUntil }, { status: LOCKED_STATUS })
      }
    } catch {
      // Fail open: the generic error below still applies.
    }
    // Generic error on purpose: never reveal whether the email exists
    // or the password was wrong.
    return NextResponse.json({ error: 'invalid' }, { status: 401 })
  }

  // 4. Blocked users cannot stay logged in. Fail-open: if the profile
  // query itself errors, the login continues as before (middleware and
  // the admin page remain as further layers).
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_blocked')
    .eq('id', data.user.id)
    .single()
  if (!profileError && profile?.is_blocked) {
    await supabase.auth.signOut()
    return NextResponse.json({ error: 'blocked' }, { status: 403 })
  }

  // 5. Success clears the lock for this email. Best-effort: if the
  // RPC fails, the login still succeeds and the lock expires on its own.
  try {
    await supabase.rpc('clear_login_attempts', { p_email: email })
  } catch {}

  return NextResponse.json({ ok: true, user: { id: data.user.id, email: data.user.email } })
}
