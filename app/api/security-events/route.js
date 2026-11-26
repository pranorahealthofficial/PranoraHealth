import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { getClientIp, isRateLimited } from '@/lib/rate-limit'
import { recordSecurityEvent } from '@/lib/security-events'

// Client-reported failed logins only. The browser login form reports a
// failed sign-in here; blocked attempts and admin grants are recorded
// server-side / by a DB trigger instead, so this route accepts nothing
// else. No email address, password, token, or IP is accepted or stored.
//
// Rate limit: 10 reports per IP per 10 minutes, so one IP cannot flood
// the alerts list. The limiter fails open. Recording itself also fails
// open: this route always answers ok:true for a well-formed report, even
// when the events table does not exist yet (SQL draft not applied).
// Honest limit: anyone can call Supabase Auth directly and bypass the
// login form, so these reports only cover guessing through the site UI.
const REPORT_LIMIT = 10
const REPORT_WINDOW_MS = 10 * 60 * 1000

export async function POST(request) {
  if (isRateLimited(`security-events:${getClientIp(request)}`, REPORT_LIMIT, REPORT_WINDOW_MS)) {
    return NextResponse.json({ error: 'Too many reports. Please try again later.' }, { status: 429, headers: { 'Retry-After': '600' } })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  if (body?.event_type !== 'failed_login') {
    return NextResponse.json({ error: 'Invalid event.' }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()
  await recordSecurityEvent(supabase, 'failed_login', 'login failed in site form')

  return NextResponse.json({ ok: true })
}
