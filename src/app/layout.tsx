import { Suspense, type ReactNode } from 'react'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import './globals.css'
import { Analytics } from '@/components/analytics'

export const metadata: Metadata = {
  title: 'Mission Control OS',
  description: 'AI-Powered Productivity Operating System',
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const nonce = (await headers()).get('x-nonce') ?? undefined

  return (
    <html lang="en" className="dark" data-theme="dark-ops">
      <head>
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('app-theme');if(t)document.documentElement.dataset.theme=t}catch(e){}})()`
          }}
        />
      </head>
      <body className="antialiased">
        {children}
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
