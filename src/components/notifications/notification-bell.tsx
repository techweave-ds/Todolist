'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, CheckCheck, X, Clock, Trophy, Zap, Sparkles, MessageSquare, Target, Flag } from 'lucide-react'
import { useAppStore } from '@/store/app-store'
import { notificationService } from '@/services/notifications/notification-service'
import type { NotificationType } from '@/core/types'
import { formatRelativeDate } from '@/lib/utils'

const iconMap: Record<string, React.ReactNode> = {
  achievement: <Trophy className="w-3.5 h-3.5 text-yellow-400" />,
  streak: <Zap className="w-3.5 h-3.5 text-amber-400" />,
  reminder: <Clock className="w-3.5 h-3.5 text-blue-400" />,
  focus: <Sparkles className="w-3.5 h-3.5 text-emerald-400" />,
  mission: <Target className="w-3.5 h-3.5 text-primary" />,
  system: <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />,
}

export function NotificationBell() {
  const { notifications, unreadCount, userId, setNotifications, setUnreadCount } = useAppStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleMarkRead(id: string) {
    if (!userId) return
    await notificationService.markAsRead(id, userId)
    setNotifications(notifications.map(n => (n as any).id === id ? { ...n, read: true } : n) as any)
    setUnreadCount(Math.max(0, unreadCount - 1))
  }

  async function handleMarkAllRead() {
    if (!userId) return
    await notificationService.markAllAsRead(userId)
    setNotifications(notifications.map(n => ({ ...n, read: true })) as any)
    setUnreadCount(0)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 glass rounded-xl border shadow-2xl z-50 max-h-96 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <span className="text-sm font-medium">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <CheckCheck className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No notifications yet
              </div>
            ) : (
              notifications.slice(0, 30).map((n: any) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-muted/20 transition-colors cursor-pointer ${
                    !n.read ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => !n.read && handleMarkRead(n.id)}
                >
                  <div className="mt-0.5 shrink-0">
                    {iconMap[n.type] || <Bell className="w-3.5 h-3.5 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{n.title}</p>
                    {n.message && (
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                    )}
                    <p className="text-[10px] text-muted-foreground/50 mt-1">
                      {formatRelativeDate(n.createdAt)}
                    </p>
                  </div>
                  {!n.read && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMarkRead(n.id) }}
                      className="shrink-0 p-1 rounded hover:bg-muted/50 transition-colors"
                    >
                      <X className="w-3 h-3 text-muted-foreground" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
