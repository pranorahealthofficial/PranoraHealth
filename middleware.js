import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { recordSecurityEvent } from './lib/security-events'

export async function middleware(request) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value, options)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  if (['/dashboard', '/checkout'].some(p => path.startsWith(p)) && !user) {
    return NextResponse.redirect(new URL('/auth/login?redirect=' + path, request.url))
  }

  if (path.startsWith('/admin') && !user) {
    return NextResponse.redirect(new URL('/auth/login?redirect=/admin', request.url))
  }

  if (user) {
    const { data: profile, error: profileError } = await supabase.from('profiles').select('role, is_blocked').eq('id', user.id).single()
    // Fail-open: a transient profile-query error must not lock a user out.
    // The admin page still enforces the admin check client-side.
    if (!profileError && profile?.is_blocked) {
      // Security event (fail-open, skipped when the events table is absent).
      await recordSecurityEvent(supabase, 'blocked_attempt', 'blocked account reached a protected page', user.id, user.id)
      return NextResponse.redirect(new URL('/auth/login?error=blocked', request.url))
    }
    if (!profileError && path.startsWith('/admin') && profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return supabaseResponse
}
export const config = {
  matcher: ['/dashboard', '/dashboard/:path*', '/checkout', '/checkout/:path*', '/admin', '/admin/:path*'],
}
