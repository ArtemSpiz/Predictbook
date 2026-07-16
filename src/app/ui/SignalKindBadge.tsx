/** Coloured pill showing whether a signal is a whale alert or an arbitrage. */
export function SignalKindBadge({ kind }: { kind?: 'whale' | 'arbitrage' | null }) {
  const isWhale = kind === 'whale'
  return (
    <div
      className={`py-1 px-1.5 border border-solid text-nowrap text-xs uppercase max-h-[20px] leading-none ${
        isWhale
          ? 'border-cat-whale-border text-cat-whale-text bg-cat-whale-bg'
          : 'border-cat-arb-border bg-cat-arb-bg text-cat-arb-text'
      }`}
    >
      {isWhale ? 'Whale Alert' : 'Arbitrage'}
    </div>
  )
}
