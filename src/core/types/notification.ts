export type NotificationType = 'achievement' | 'streak' | 'reminder' | 'focus' | 'mission' | 'system'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string | null
  data: Record<string, unknown> | null
  read: boolean
  createdAt: string
}
