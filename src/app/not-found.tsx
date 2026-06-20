import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', textAlign: 'center', padding: '2rem' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem' }}>404</h1>
      <p style={{ color: '#a1a1aa', marginBottom: '1.5rem' }}>This page could not be found.</p>
      <Link href="/" style={{ color: '#6366f1', textDecoration: 'underline' }}>Return home</Link>
    </div>
  )
}
