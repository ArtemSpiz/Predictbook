import Image from 'next/image'
import Live from '../../../public/live.png'

/** LIVE indicator. The caller passes the full container `className` so each
 * placement keeps its exact layout classes. */
export function LiveBadge({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Image src={Live} alt="" className="w-4 h-4" />
      LIVE
    </div>
  )
}
