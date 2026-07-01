'use client'

import { Search, Command } from 'lucide-react'
import { useAppStore } from '@/store/app-store'
import { NotificationBell } from '@/components/notifications/notification-bell'

export function Header() {
  const { toggleCommandPalette, userId, isDemo } = useAppStore()

  const avatarInitial = isDemo
    ? 'D'
    : userId
      ? userId.charAt(0).toUpperCase()
      : 'U'

  return (
    <header className="fixed top-0 left-64 right-0 h-16 glass border-b z-30">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-glow" />
            <span>SYSTEM ONLINE</span>
          </div>
          <span className="text-muted-foreground/20">|</span>
          <span className="text-xs text-muted-foreground/40 tabular-nums">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleCommandPalette}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm w-64"
          >
            <Search className="w-4 h-4" />
            <span>Quick command...</span>
            <kbd className="ml-auto flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-xs">
              <Command className="w-3 h-3" />K
            </kbd>
          </button>

          <NotificationBell />

          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-white">
            {avatarInitial}
          </div>
        </div>
      </div>
    </header>
  )
}
