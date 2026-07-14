const globals = globalThis as { __signalsSyncSecret?: string }

/**
 * Shared secret between the in-process poller and /api/signals-sync. Taken from
 * SIGNALS_SYNC_SECRET when set; otherwise generated once per boot, which is
 * enough because both sides live in the same Node process. Uses the global Web
 * Crypto API — `node:` imports break webpack's instrumentation bundle.
 */
export function getSyncSecret(): string {
  globals.__signalsSyncSecret ??= process.env.SIGNALS_SYNC_SECRET || crypto.randomUUID()
  return globals.__signalsSyncSecret
}
