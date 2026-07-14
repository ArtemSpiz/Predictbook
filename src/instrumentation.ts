export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  if (process.env.NEXT_PHASE === 'phase-production-build') return
  if (process.env.SIGNALS_SYNC_ENABLED === 'true') {
    const { startSignalsPoller } = await import('./lib/signals-sync/poller')
    startSignalsPoller()
  }
  if (process.env.TICKER_SYNC_ENABLED === 'true') {
    const { startTickerPoller } = await import('./lib/ticker-sync/poller')
    startTickerPoller()
  }
}
