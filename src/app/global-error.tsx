'use client'

export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  return (
    <html>
      <body className="dark antialiased" style={{ margin: 0, background: '#0a0a0b', color: '#e4e4e7' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', textAlign: 'center', padding: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Something went wrong</h1>
          <p style={{ color: '#a1a1aa', marginBottom: '1.5rem' }}>An unexpected error occurred. Our team has been notified.</p>
          <button
            onClick={() => unstable_retry()}
            style={{
              padding: '0.5rem 1.5rem', borderRadius: '0.5rem', border: '1px solid #27272a',
              background: '#18181b', color: '#e4e4e7', cursor: 'pointer', fontSize: '0.875rem'
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
