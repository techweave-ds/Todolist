import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="dark" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', textAlign: 'center', padding: '2rem' }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 700, marginBottom: '0.5rem' }}>404</h1>
      <p style={{ marginBottom: '1.5rem' }}>This page could not be found.</p>
      <Link href="/" className="text-primary underline">Return home</Link>
    </div>
  )
}
