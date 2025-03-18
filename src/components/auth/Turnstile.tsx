'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile: any
    onTurnstileLoad?: () => void
    turnstileQueue?: Array<() => void>
  }
}

interface TurnstileProps {
  onVerify: (token: string) => void
  onError?: () => void
  action?: string
}

export default function Turnstile({ onVerify, onError, action }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string>()

  useEffect(() => {
    let mounted = true

    const initTurnstile = () => {
      if (!mounted || !containerRef.current) return

      try {
        if (window.turnstile) {
          // Remove existing widget if it exists
          if (widgetId.current) {
            try {
              window.turnstile.remove(widgetId.current)
            } catch (e) {
              console.error('Error removing existing widget:', e)
            }
          }

          // Render new widget
          widgetId.current = window.turnstile.render(containerRef.current, {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
            callback: (token: string) => {
              console.log('Turnstile verification successful')
              onVerify(token)
            },
            'error-callback': () => {
              console.error('Turnstile verification failed')
              onError?.()
            },
            'expired-callback': () => {
              console.log('Turnstile token expired, refreshing...')
              if (widgetId.current) {
                window.turnstile.reset(widgetId.current)
              }
            },
            action,
            theme: 'light',
            language: 'auto',
            'refresh-expired': 'auto',
            size: 'invisible',
          })
        }
      } catch (err) {
        console.error('Error initializing Turnstile:', err)
        onError?.()
      }
    }

    // Initialize queue if it doesn't exist
    if (!window.turnstileQueue) {
      window.turnstileQueue = []
    }

    const loadTurnstile = () => {
      // If script is already loaded, initialize immediately
      if (window.turnstile) {
        initTurnstile()
        return
      }

      // Add to queue if script is loading
      window.turnstileQueue.push(initTurnstile)

      // Check if script is already being loaded
      if (document.querySelector('script[src*="turnstile"]')) {
        return
      }

      // Load script if not already loading
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad'
      script.async = true
      script.defer = true

      // Define the onload callback
      window.onTurnstileLoad = () => {
        console.log('Turnstile script loaded')
        // Process all queued initializations
        window.turnstileQueue?.forEach(init => init())
        window.turnstileQueue = []
      }

      document.body.appendChild(script)
    }

    loadTurnstile()

    return () => {
      mounted = false
      if (widgetId.current) {
        try {
          window.turnstile.remove(widgetId.current)
        } catch (e) {
          console.error('Error removing Turnstile widget:', e)
        }
      }
    }
  }, [onVerify, onError, action])

  return (
    <div 
      ref={containerRef}
      style={{ display: 'none' }}
    />
  )
} 