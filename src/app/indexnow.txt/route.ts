/**
 * Serves the IndexNow key verification file at `/indexnow.txt`. The key lives in
 * the `INDEXNOW_KEY` env var (per deployment), so it can't be a static public
 * file. Returns 404 when unset.
 */
export function GET() {
  const key = process.env.INDEXNOW_KEY?.trim()
  if (!key) return new Response('Not found', { status: 404 })
  return new Response(key, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
