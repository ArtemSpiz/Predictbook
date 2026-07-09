'use client'

import { useState, FormEvent } from 'react'
import Lock from '@/../public/Locked.png'
import Chevron from '@/../public/down.png'
import Captcha from '@/../public/captcha.png'

import Image from 'next/image'

type Subject = '' | 'general' | 'support' | 'feedback' | 'other'

interface FormState {
  fullName: string
  email: string
  subject: Subject
  message: string
}

interface FormErrors {
  fullName?: string
  email?: string
  subject?: string
  message?: string
  captcha?: string
}

const SUBJECT_OPTIONS: { value: Subject; label: string }[] = [
  { value: 'general', label: 'General inquiry' },
  { value: 'support', label: 'Support' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'other', label: 'Other' },
]

const MIN_MESSAGE_LENGTH = 10

function LockIcon() {
  return <Image src={Lock} alt="" className="w-4 h-4" />
}

function ChevronIcon() {
  return <Image src={Chevron} alt="" className="w-4 h-4" />
}

export default function ContactCard() {
  const [form, setForm] = useState<FormState>({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isVerified, setIsVerified] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent'>('idle')

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function validate(): FormErrors {
    const next: FormErrors = {}
    if (!form.fullName.trim()) next.fullName = 'Full name is required'
    if (!form.email.trim()) {
      next.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email address'
    }
    if (!form.subject) next.subject = 'Please select a subject'
    if (form.message.trim().length < MIN_MESSAGE_LENGTH) {
      next.message = `Message must be at least ${MIN_MESSAGE_LENGTH} characters`
    }
    if (!isVerified) next.captcha = 'Please confirm you are not a robot'
    return next
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setStatus('submitting')
    await new Promise((resolve) => setTimeout(resolve, 800))
    setStatus('sent')
    setTimeout(() => {
      setStatus('idle')
    }, 1500)
  }

  return (
    <div className="relative w-full max-w-2xl bg-white border border-gray-100 overflow-hidden">
      {status === 'sent' && (
        <div className="fixed top-5 right-5 z-10 rounded-lg border border-green-200 bg-green-50 px-4 py-3 shadow">
          <p className="text-sm font-semibold text-green-700">Message sent successfully</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 max-md:p-4 sm:p-10 space-y-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900 mb-2">
              Full name <span className="text-gray-900">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Your full name"
              value={form.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
            />
            {errors.fullName && <p className="mt-1.5 text-xs text-red-500">{errors.fullName}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
              Email address <span className="text-gray-900">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
            />
            {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">
            Subject <span className="text-gray-900">*</span>
          </label>
          <div className="relative">
            <select
              id="subject"
              value={form.subject}
              onChange={(e) => updateField('subject', e.target.value as Subject)}
              className="w-full appearance-none rounded-lg border border-gray-200 px-4 py-3 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition bg-white"
            >
              <option value="" disabled hidden className="text-gray-400">
                Select a subject
              </option>
              {SUBJECT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <ChevronIcon />
            </div>
          </div>
          {errors.subject && <p className="mt-1.5 text-xs text-red-500">{errors.subject}</p>}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
            Message <span className="text-gray-900">*</span>
          </label>
          <textarea
            id="message"
            rows={7}
            placeholder="Write your message here..."
            value={form.message}
            onChange={(e) => updateField('message', e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
          />
          <p className="mt-1.5 text-xs text-gray-400">Minimum {MIN_MESSAGE_LENGTH} characters</p>
          {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
        </div>

        <div>
          <button
            type="button"
            onClick={() => {
              setIsVerified((v) => !v)
              setErrors((prev) => ({ ...prev, captcha: undefined }))
            }}
            className="w-full sm:w-auto inline-flex items-center gap-4 rounded-s border border-gray-border bg-gray-softer px-5 border-solid py-4"
          >
            <span
              className={`h-5 w-5 shrink-0 rounded-[2px] border-2 flex items-center justify-center transition ${
                isVerified ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
              }`}
            >
              {isVerified && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            <span className="text-sm text-gray-700">I'm not a robot</span>
            <span className="ml-auto flex flex-col items-center text-[9px] text-gray-400 leading-tight pl-6">
              <Image src={Captcha} alt="" className="w-10 h-10" />
              <span className="space-x-1">
                <span className="underline">Privacy</span>
                <span>-</span>
                <span className="underline">Terms</span>
              </span>
            </span>
          </button>
          {errors.captcha && <p className="mt-1.5 text-xs text-red-500">{errors.captcha}</p>}
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full rounded-lg bg-gray-900 text-white font-medium py-3.5 text-sm hover:bg-gray-800 transition disabled:opacity-60"
        >
          {status === 'submitting' ? 'Sending...' : 'Send message'}
        </button>

        <p className="flex items-center gap-2 text-xs text-gray-400">
          <LockIcon />
          We respect your privacy. Your information will only be used to respond to your message.
        </p>
      </form>
    </div>
  )
}
