import { PulseDot } from '@/app/ui/PulseDot'

export function SignalsTodayBadge({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1">
      <PulseDot />
      <div className="text-success text-sm">{count} signals today</div>
    </div>
  )
}
