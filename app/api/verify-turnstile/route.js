import { NextResponse } from 'next/server'
import { getClientIp, isRateLimited } from '@/lib/rate-limit'

// Verifies a Cloudflare Turnstile token server-side. The secret is never
// returned or logged, and the token is never logged. When no secret is
// configured, verification is inactive and callers proceed as today.
//
// Rate limit: 30 requests per IP per 10 minutes. The limiter fails open,
// so a limiter error never blocks a legitimate verification.
const VERIFY_LIMIT = 30
const VERIFY_WINDOW_MS = 10 * 60 * 1000

export async function POST(request) {
  if (isRateLimited(`verify-turnstile:${getClientIp(request)}`, VERIFY_LIMIT, VERIFY_WINDOW_MS)) {
    return NextResponse.json({ ok: false, error: 'Too many attempts. Please try again later.' }, { status: 429, headers: { 'Retry-After': '600' } })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    return NextResponse.json({ ok: false, reason: 'not_configured' })
  }

  const token = body?.token
  if (!token || typeof token !== 'string') {
    return NextResponse.json({ ok: false })
  }

  try {
    const form = new URLSearchParams()
    form.append('secret', secret)
    form.append('response', token)
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
    })
    const data = await res.json()
    return NextResponse.json({ ok: data?.success === true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
