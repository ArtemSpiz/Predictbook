import { useEffect, useRef, useState, type FormEvent } from 'react'

type Status = 'idle' | 'submitting' | 'sent' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

export function useNewsletterForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)
  const [status, setStatus] = useState<Status>('idle')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(resetTimer.current), [])

  function updateEmail(value: string) {
    setEmail(value)
    setError(undefined)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!EMAIL_RE.test(email.trim())) {
      setError('Enter a valid email address')
      return
    }
    if (TURNSTILE_SITE_KEY && !captchaToken) {
      setError('Please complete the captcha')
      return
    }

    setStatus('submitting')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          turnstileToken: captchaToken,
          referrer: typeof document !== 'undefined' ? document.referrer : undefined,
          landingUrl: typeof window !== 'undefined' ? window.location.href : undefined,
        }),
      })
      if (res.ok) {
        setStatus('sent')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
    setCaptchaToken(null)
    resetTimer.current = setTimeout(() => setStatus('idle'), 3000)
  }

  return { email, error, status, updateEmail, handleSubmit, setCaptchaToken }
}
