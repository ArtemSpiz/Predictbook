'use client'

// Last-resort boundary: without it, a render/layout crash yields a blank page
// with no visible error. Shows the message + digest (digest correlates to the
// full stack in the server logs, since production redacts the client message).
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: 24, lineHeight: 1.5 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Something went wrong</h1>
        <p>{error.message || 'An unexpected error occurred.'}</p>
        {error.digest && (
          <p>
            Error digest: <code>{error.digest}</code>
          </p>
        )}
        {error.stack && (
          <pre style={{ whiteSpace: 'pre-wrap', color: '#b00020', marginTop: 12 }}>
            {error.stack}
          </pre>
        )}
        <button onClick={() => reset()} style={{ marginTop: 16 }}>
          Try again
        </button>
      </body>
    </html>
  )
}
