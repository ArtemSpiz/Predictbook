'use client'

import Image from 'next/image'
import { useState } from 'react'
import Copy from '@/../public/Copy.png'

/** Opens the native share sheet (social networks) for the current page,
 * falling back to copying the URL where the Web Share API is unavailable. */
export function SharePageButton({ title }: { title?: string }) {
  const [copied, setCopied] = useState(false)

  const onShare = async () => {
    const url = window.location.href
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        // user dismissed the share sheet — nothing to do
      }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard blocked — nothing to do
    }
  }

  return (
    <button
      type="button"
      onClick={onShare}
      title={copied ? 'Link copied' : 'Share'}
      aria-label="Share this page"
      className="border border-line cursor-pointer rounded-md w-10 h-10 flex justify-center items-center bg-transparent"
    >
      <Image src={Copy} alt="" className="object-contain" />
    </button>
  )
}
