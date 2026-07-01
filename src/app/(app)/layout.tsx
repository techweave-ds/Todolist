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
  return (
    <div className="min-h-screen relative">
      <GlowBackground />
      <SessionInitializer />
      <NotificationProvider />
      <Sidebar />
      <Header />
      <main className="pl-64 pt-16 min-h-screen relative z-10">
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <CommandPalette />
    </div>
  )
}
