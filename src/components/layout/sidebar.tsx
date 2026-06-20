'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Target,
  Flag,
  Brain,
  Trophy,
  BarChart3,
  History,
  Settings,
  Rocket,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Missions', href: '/missions', icon: Target },
  { label: 'Campaigns', href: '/campaigns', icon: Flag },
  { label: 'Focus', href: '/focus', icon: Brain },
  { label: 'Achievements', href: '/achievements', icon: Trophy },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Memory Lane', href: '/memory-lane', icon: History },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
      <aside className="fixed left-0 top-0 h-screen w-64 glass border-r z-40">
        <div className="flex flex-col h-full p-4">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-4 mb-6 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Rocket className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gradient">Mission Control</h1>
              <p className="text-xs text-muted-foreground">OS v1.0</p>
            </div>
          </Link>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-gradient-to-b from-primary to-accent" />
                  )}
                  <Icon className={cn('w-4 h-4', isActive && 'drop-shadow-glow')} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <Link
            href="/settings"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative',
              pathname === '/settings'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            {pathname === '/settings' && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-gradient-to-b from-primary to-accent" />
            )}
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </div>
      </aside>
  )
}
