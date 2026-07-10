'use client'

import Image from 'next/image'
import Arrow from '../../../public/down.png'

export function LoadMoreButton({
  onClick,
  isPending = false,
}: {
  onClick?: () => void
  isPending?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      className="bg-sand justify-center group w-max mx-auto border-none flex items-center gap-2 px-3 py-2.5 rounded-lg disabled:opacity-60"
    >
      <span>{isPending ? 'Loading...' : 'Load more'}</span>
      <Image src={Arrow} alt="Arrow" className="w-4 h-4 relative" />
    </button>
  )
}
