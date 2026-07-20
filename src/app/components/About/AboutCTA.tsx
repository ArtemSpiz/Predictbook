'use client'

import CTAbg from '@/../public/CTAbg.png'
import CustomBtn from '@/app/ui/CustomBtn'
import Image from 'next/image'
import type { AboutPage } from '@/payload-types'
import { useNewsletterForm } from '@/app/hooks/useNewsletterForm'
import { Turnstile } from '@/app/components/Contact/Turnstile'

export default function AboutCTA({ cta }: { cta?: AboutPage['cta'] }) {
  const { email, error, status, updateEmail, handleSubmit, setCaptchaToken } = useNewsletterForm()

  return (
    <div className="flex relative items-center justify-center text-center flex-col p-6 gap-4 bg-ink">
      <div className="absolute pointer-events-none top-1/2 -translate-y-1/2 right-0 w-full h-full">
        <Image src={CTAbg} alt="" />
      </div>

      <div>
        <div className="text-white text-2xl max-md:text-lg">{cta?.heading ?? 'Stay in the loop'}</div>
        <div className="text-white text-sm max-w-[440px] mx-auto">
          {cta?.text ??
            'Never miss the latest market analysis, prediction insights, and emerging opportunities. Delivered straight to your inbox.'}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative flex flex-col gap-2 items-center">
        <div className="flex self-stretch gap-2 mx-auto max-md:flex-col">
          <input
            type="email"
            value={email}
            onChange={(e) => updateEmail(e.target.value)}
            placeholder={cta?.placeholder ?? 'Your email'}
            aria-label="Email address"
            className="bg-white-a24 md:min-w-[230px] focus:outline-none p-2.5 border border-sand-a32 rounded-lg placeholder:text-white-a56 text-white backdrop-blur-sm"
          />
          <div className="w-max max-md:w-full">
            <CustomBtn
              text={
                status === 'submitting'
                  ? 'Subscribing...'
                  : status === 'sent'
                    ? 'Subscribed'
                    : (cta?.buttonText ?? 'Subscribe')
              }
              icon={false}
              type="submit"
              disabled={status === 'submitting'}
            />
          </div>
        </div>

        <Turnstile onToken={setCaptchaToken} />

        {error && <p className="text-xs text-red-300">{error}</p>}
        {status === 'sent' && (
          <p className="text-xs text-green-300">Thanks — you&apos;re subscribed.</p>
        )}
        {status === 'error' && (
          <p className="text-xs text-red-300">Something went wrong. Please try again.</p>
        )}
      </form>
    </div>
  )
}
