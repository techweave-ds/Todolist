'use client'

import { useNotificationPoll } from '@/hooks/use-notifications'

export function NotificationProvider() {
  useNotificationPoll()
  return null
}
