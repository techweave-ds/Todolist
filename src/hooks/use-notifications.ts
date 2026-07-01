'use client'

import { useEffect, useRef } from 'react'
import { useAppStore } from '@/store/app-store'
import { getNotifications, getUnreadCount } from '@/app/actions'
import type { Notification as AppNotification } from '@/core/types/notification'

const POLL_INTERVAL = 30000

export function useNotificationPoll() {
  const { userId, setNotifications, setUnreadCount } = useAppStore()
  const notifiedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!userId) return

    let active = true
    const uid = userId

    async function poll() {
      if (!active) return
      try {
        const [all, count] = await Promise.all([
          getNotifications(),
          getUnreadCount(),
        ])
        if (!active) return

        const mapped = all as unknown as AppNotification[]
        setNotifications(mapped)
        setUnreadCount(count)

        for (const n of mapped) {
          const anyN = n as any
          if (anyN.type === 'reminder' && !anyN.read) {
            const data = anyN.data as { remindAt?: string; missionId?: string } | null
            if (data?.remindAt && new Date(data.remindAt) <= new Date()) {
              const key = n.id
              if (!notifiedRef.current.has(key)) {
                notifiedRef.current.add(key)
                if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                  new Notification(anyN.title, { body: anyN.message || undefined })
                }
              }
            }
          }
        }
      } catch {
        // poll will retry
      }
    }

    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    poll()
    const interval = setInterval(poll, POLL_INTERVAL)
    return () => { active = false; clearInterval(interval) }
  }, [userId, setNotifications, setUnreadCount])
}
