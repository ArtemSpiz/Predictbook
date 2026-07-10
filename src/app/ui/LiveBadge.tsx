import Image from 'next/image'
import Live from '../../../public/live.png'

const BASE = 'flex gap-2 items-center px-1.5 py-1 text-xs font-medium uppercase text-danger'

/** LIVE indicator. Common styling lives here; callers pass only per-placement
 * classes (background, layout) via `className`. */
export function LiveBadge({ className }: { className?: string }) {
  return (
    <div className={`${BASE} ${className ?? ''}`}>
      <Image src={Live} alt="" className="w-4 h-4 animate-live-pulse" />
      LIVE
    </div>
  )
}
