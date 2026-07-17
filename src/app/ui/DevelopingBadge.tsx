const BASE = 'flex items-center px-1.5 py-1 text-xs font-bold uppercase text-developing'

/** DEVELOPING indicator. Common styling lives here; callers pass only
 * per-placement classes via `className`. */
export function DevelopingBadge({ className }: { className?: string }) {
  return <div className={`${BASE} ${className ?? ''}`}>Developing</div>
}
