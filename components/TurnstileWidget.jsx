'use client'
import { useEffect, useRef } from 'react'

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

// Renders nothing when no Turnstile site key is configured, so forms
// behave exactly as today until keys are set. No key is hardcoded here.
export default function TurnstileWidget({ onVerify }) {
  const containerRef = useRef(null)
  const widgetIdRef = useRef(null)
  const onVerifyRef = useRef(onVerify)
  onVerifyRef.current = onVerify

  useEffect(() => {
    if (!SITE_KEY || !containerRef.current) return undefined
    let cancelled = false

    const renderWidget = () => {
      if (cancelled || !containerRef.current || !window.turnstile || widgetIdRef.current !== null) return
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        callback: (token) => onVerifyRef.current?.(token),
        'expired-callback': () => onVerifyRef.current?.(''),
        'error-callback': () => onVerifyRef.current?.(''),
      })
    }

    if (window.turnstile) {
      renderWidget()
      return undefined
    }

    const existing = document.querySelector('script[data-turnstile-script]')
    if (existing) {
      existing.addEventListener('load', renderWidget)
      return () => existing.removeEventListener('load', renderWidget)
    }

    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true
    script.dataset.turnstileScript = 'true'
    script.addEventListener('load', renderWidget)
    document.head.appendChild(script)
    return () => {
      cancelled = true
      script.removeEventListener('load', renderWidget)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current) } catch { /* already gone */ }
      }
      widgetIdRef.current = null
    }
  }, [])

  if (!SITE_KEY) return null
  return <div ref={containerRef} className="flex justify-center" />
}
