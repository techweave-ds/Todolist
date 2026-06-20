'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Target, Flag, Brain, Trophy, BarChart3, History } from 'lucide-react'
import { useAppStore } from '@/store/app-store'
import { useKeyboard } from '@/hooks/use-keyboard'

const commands = [
  { label: 'Go to Dashboard', href: '/dashboard', icon: Search },
  { label: 'Create Mission', href: '/missions?create=true', icon: Target },
  { label: 'Create Campaign', href: '/campaigns?create=true', icon: Flag },
  { label: 'Start Focus Session', href: '/focus', icon: Brain },
  { label: 'View Achievements', href: '/achievements', icon: Trophy },
  { label: 'View Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'View Memory Lane', href: '/memory-lane', icon: History },
]

export function CommandPalette() {
  const router = useRouter()
  const { isCommandPaletteOpen, toggleCommandPalette } = useAppStore()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filtered = query
    ? commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands

  const execute = useCallback((href: string) => {
    toggleCommandPalette()
    router.push(href)
  }, [router, toggleCommandPalette])

  useKeyboard('k', toggleCommandPalette)

  useEffect(() => {
    if (!isCommandPaletteOpen) {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isCommandPaletteOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (!isCommandPaletteOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, filtered.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
      }
      if (e.key === 'Enter' && filtered[selectedIndex]) {
        execute(filtered[selectedIndex].href)
      }
      if (e.key === 'Escape') {
        toggleCommandPalette()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCommandPaletteOpen, filtered, selectedIndex, execute, toggleCommandPalette])

  if (!isCommandPaletteOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={toggleCommandPalette} />
      <div className="relative w-full max-w-lg glass-strong rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search or type a command..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground">ESC</kbd>
        </div>
        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.map((cmd, i) => {
            const Icon = cmd.icon
            return (
              <button
                key={cmd.href}
                onClick={() => execute(cmd.href)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  i === selectedIndex ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cmd.label}
              </button>
            )
          })}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No results found</p>
          )}
        </div>
      </div>
    </div>
  )
}
