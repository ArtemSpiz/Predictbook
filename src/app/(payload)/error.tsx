'use client'

// Scoped boundary for the admin group so a render error in the Payload admin
// surfaces a message + digest instead of a blank screen.
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24, lineHeight: 1.5 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Admin failed to render</h1>
      <p>{error.message || 'An unexpected error occurred.'}</p>
      {error.digest && (
        <p>
          Error digest: <code>{error.digest}</code>
        </p>
      )}
      <button onClick={() => reset()} style={{ marginTop: 16 }}>
        Try again
      </button>
    </div>
  )
}
