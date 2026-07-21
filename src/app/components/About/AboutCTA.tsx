import CTAbg from '@/../public/CTAbg.png'
import Image from 'next/image'
import type { AboutPage } from '@/payload-types'

const DEFAULT_EMBED_URL = 'https://predictbook.substack.com/embed'

export default function AboutCTA({ cta }: { cta?: AboutPage['cta'] }) {
  const embedUrl = cta?.embedUrl || DEFAULT_EMBED_URL

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

      <iframe
        src={embedUrl}
        title="Subscribe to the Predictbook newsletter"
        className="relative w-full max-w-[440px] h-[150px] rounded-lg bg-white"
        frameBorder="0"
        scrolling="no"
      />
    </div>
  )
}
