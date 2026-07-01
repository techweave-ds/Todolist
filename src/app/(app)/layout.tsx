'use client'

import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { CommandPalette } from '@/components/layout/command-palette'
import { SessionInitializer } from '@/components/auth/session-initializer'
import { GlowBackground } from '@/components/ui/glow-background'
import { NotificationProvider } from '@/components/notifications/notification-provider'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen relative">
      <GlowBackground />
      <SessionInitializer />
      <NotificationProvider />
      <Sidebar />
      <Header />
      <main className="pl-64 pt-16 min-h-screen relative z-10">
        <div className="p-6 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <CommandPalette />
    </div>
  )
}
