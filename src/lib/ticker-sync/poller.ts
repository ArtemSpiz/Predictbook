import { getSyncSecret } from '@/lib/signals-sync/secret'

const globals = globalThis as { __tickerPollerStarted?: boolean }

/**
 * Interval loop that triggers /api/ticker-sync on this instance. Goes through
 * HTTP (not the Local API directly) so each tick runs in a request scope where
 * revalidateTag works. Assumes a single app instance.
 */
export function startTickerPoller(): void {
  if (globals.__tickerPollerStarted) return
  globals.__tickerPollerStarted = true

  const intervalMs = Number(process.env.TICKER_SYNC_INTERVAL_MS ?? 300000)
  const port = process.env.PORT ?? 3000
  const url = `http://localhost:${port}/api/ticker-sync`
  let inFlight = false

  console.info(`[ticker-sync] poller started: ${url} every ${intervalMs}ms`)

  const tick = async () => {
    if (inFlight) return
    inFlight = true
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'x-sync-secret': getSyncSecret() },
        // A tick can crawl up to KALSHI_SYNC_MAX_PAGES sequential requests.
        signal: AbortSignal.timeout(Math.max(intervalMs, 60000)),
      })
      if (!res.ok) console.error(`[ticker-sync] tick returned ${res.status}`)
    } catch (err) {
      // Server may not be listening yet right after boot; just retry next tick.
      console.error('[ticker-sync] tick failed:', err)
    } finally {
      inFlight = false
    }
  }

  // Long default interval — run once shortly after boot so the ticker fills fast.
  setTimeout(tick, 5000)
  setInterval(tick, intervalMs)
}
