import { Suspense, type ReactNode } from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@/components/analytics'

export const metadata: Metadata = {
  title: 'Mission Control OS',
  description: 'AI-Powered Productivity Operating System',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
