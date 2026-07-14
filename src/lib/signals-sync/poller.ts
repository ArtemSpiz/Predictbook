const globals = globalThis as { __signalsPollerStarted?: boolean }

/**
 * Interval loop that triggers /api/signals-sync on this instance. Goes through
 * HTTP (not the Local API directly) so each tick runs in a request scope where
 * revalidateTag works. Assumes a single app instance.
 */
export function startSignalsPoller(): void {
  if (globals.__signalsPollerStarted) return
  globals.__signalsPollerStarted = true

  const intervalMs = Number(process.env.SIGNALS_SYNC_INTERVAL_MS ?? 10000)
  const port = process.env.PORT ?? 3000
  const url = `http://localhost:${port}/api/signals-sync`
  let inFlight = false

  console.info(`[signals-sync] poller started: ${url} every ${intervalMs}ms`)

  setInterval(async () => {
    if (inFlight) return
    inFlight = true
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'x-sync-secret': process.env.SIGNALS_SYNC_SECRET ?? '' },
        signal: AbortSignal.timeout(Math.max(intervalMs * 3, 30000)),
      })
      if (!res.ok) console.error(`[signals-sync] tick returned ${res.status}`)
    } catch (err) {
      // Server may not be listening yet right after boot; just retry next tick.
      console.error('[signals-sync] tick failed:', err)
    } finally {
      inFlight = false
    }
  }, intervalMs)
}
