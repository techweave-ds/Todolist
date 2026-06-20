import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { NotificationType } from '@/core/types'
import { handleServiceError } from '@/lib/service-error'

export class NotificationService {
  async create(userId: string, type: NotificationType, title: string, message?: string, data?: Record<string, unknown>) {
    try {
      return prisma.notification.create({
        data: { userId, type, title, message, data: data as Prisma.InputJsonValue },
      })
    } catch (error) {
      handleServiceError(error, 'notificationService.create')
    }
  }

  async getUnread(userId: string) {
    try {
      return prisma.notification.findMany({
        where: { userId, read: false },
        orderBy: { createdAt: 'desc' },
      })
    } catch (error) {
      handleServiceError(error, 'notificationService.getUnread')
    }
  }

  async getAll(userId: string, limit: number = 50) {
    try {
      return prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      })
    } catch (error) {
      handleServiceError(error, 'notificationService.getAll')
    }
  }

  async markAsRead(id: string, userId: string) {
    try {
      return prisma.notification.update({
        where: { id, userId },
        data: { read: true },
      })
    } catch (error) {
      handleServiceError(error, 'notificationService.markAsRead')
    }
  }

  async markAllAsRead(userId: string) {
    try {
      return prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
      })
    } catch (error) {
      handleServiceError(error, 'notificationService.markAllAsRead')
    }
  }

  async delete(id: string, userId: string) {
    try {
      return prisma.notification.delete({ where: { id, userId } })
    } catch (error) {
      handleServiceError(error, 'notificationService.delete')
    }
  }

  async getUnreadCount(userId: string) {
    try {
      return prisma.notification.count({
        where: { userId, read: false },
      })
    } catch (error) {
      handleServiceError(error, 'notificationService.getUnreadCount')
    }
  }
}

export const notificationService = new NotificationService()
