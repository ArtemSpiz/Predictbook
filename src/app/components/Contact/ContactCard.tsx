'use client'

import Lock from '@/../public/Locked.png'
import Chevron from '@/../public/down.png'

import Image from 'next/image'
import { useContactForm, MIN_MESSAGE_LENGTH } from '@/app/hooks/useContactForm'
import { Turnstile } from '@/app/components/Contact/Turnstile'

export interface SubjectOption {
  label: string
}

const DEFAULT_SUBJECT_OPTIONS: SubjectOption[] = [
  { label: 'General inquiry' },
  { label: 'Support' },
  { label: 'Feedback' },
  { label: 'Other' },
]

interface Props {
  nameLabel?: string
  emailLabel?: string
  subjectLabel?: string
  messageLabel?: string
  subjectOptions?: SubjectOption[]
  buttonText?: string
}

function LockIcon() {
  return <Image src={Lock} alt="" className="w-4 h-4" />
}

function ChevronIcon() {
  return <Image src={Chevron} alt="" className="w-4 h-4" />
}

export default function ContactCard({
  nameLabel = 'Full name',
  emailLabel = 'Email address',
  subjectLabel = 'Subject',
  messageLabel = 'Message',
  subjectOptions = DEFAULT_SUBJECT_OPTIONS,
  buttonText = 'Send message',
}: Props) {
  const { form, errors, status, updateField, handleSubmit, setCaptchaToken } = useContactForm({
    nameLabel,
    emailLabel,
    subjectLabel,
  })

  return (
    <div className="relative w-full max-w-2xl bg-white border border-gray-100 overflow-hidden">
      {status === 'sent' && (
        <div className="fixed top-5 right-5 z-10 rounded-lg border border-green-200 bg-green-50 px-4 py-3 shadow">
          <p className="text-sm font-semibold text-green-700">Message sent successfully</p>
        </div>
      )}
      {status === 'error' && (
        <div className="fixed top-5 right-5 z-10 rounded-lg border border-red-200 bg-red-50 px-4 py-3 shadow">
          <p className="text-sm font-semibold text-red-700">Failed to send message</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 max-md:p-4 sm:p-10 space-y-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900 mb-2">
              {nameLabel} <span className="text-gray-900">*</span>
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
              {emailLabel} <span className="text-gray-900">*</span>
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
            {subjectLabel} <span className="text-gray-900">*</span>
          </label>
          <div className="relative">
            <select
              id="subject"
              value={form.subject}
              onChange={(e) => updateField('subject', e.target.value)}
              className="w-full appearance-none rounded-lg border border-gray-200 px-4 py-3 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition bg-white"
            >
              <option value="" disabled hidden className="text-gray-400">
                Select a {subjectLabel.toLowerCase()}
              </option>
              {subjectOptions.map((opt) => (
                <option key={opt.label} value={opt.label}>
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
            {messageLabel} <span className="text-gray-900">*</span>
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
          <Turnstile onToken={setCaptchaToken} />
          {errors.captcha && <p className="mt-1.5 text-xs text-red-500">{errors.captcha}</p>}
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full rounded-lg bg-gray-900 text-white font-medium py-3.5 text-sm hover:bg-gray-800 transition disabled:opacity-60"
        >
          {status === 'submitting' ? 'Sending...' : buttonText}
        </button>

        <p className="flex items-center gap-2 text-xs text-gray-400">
          <LockIcon />
          We respect your privacy. Your information will only be used to respond to your message.
        </p>
      </form>
    </div>
  )
}
