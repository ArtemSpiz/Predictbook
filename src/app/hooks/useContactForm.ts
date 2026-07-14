import { useEffect, useRef, useState, type FormEvent } from 'react'

interface FormState {
  fullName: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  fullName?: string
  email?: string
  subject?: string
  message?: string
  captcha?: string
}

type Status = 'idle' | 'submitting' | 'sent' | 'error'

export const MIN_MESSAGE_LENGTH = 10
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

interface Options {
  nameLabel: string
  emailLabel: string
  subjectLabel: string
}

export function useContactForm({ nameLabel, emailLabel, subjectLabel }: Options) {
  const [form, setForm] = useState<FormState>({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(resetTimer.current), [])

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function validate(): FormErrors {
    const next: FormErrors = {}
    if (!form.fullName.trim()) next.fullName = `${nameLabel} is required`
    if (!form.email.trim()) {
      next.email = `${emailLabel} is required`
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email address'
    }
    if (!form.subject) next.subject = `Please select a ${subjectLabel.toLowerCase()}`
    if (form.message.trim().length < MIN_MESSAGE_LENGTH) {
      next.message = `Message must be at least ${MIN_MESSAGE_LENGTH} characters`
    }
    if (TURNSTILE_SITE_KEY && !captchaToken) {
      next.captcha = 'Please complete the captcha'
    }
    return next
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setStatus('submitting')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.fullName,
          email: form.email,
          subject: form.subject,
          message: form.message,
          turnstileToken: captchaToken,
        }),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
    setCaptchaToken(null)
    resetTimer.current = setTimeout(() => setStatus('idle'), 1500)
  }

  return { form, errors, status, updateField, handleSubmit, setCaptchaToken }
}
