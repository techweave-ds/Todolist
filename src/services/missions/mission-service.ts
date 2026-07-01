import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { eventBus } from '@/core/events'
import { MissionCreateInput, MissionUpdateInput } from '@/core/types'
import { calculateMissionXP } from '@/services/xp/xp-service'
import { notificationService } from '@/services/notifications/notification-service'
import { generateId } from '@/lib/utils'
import { handleServiceError } from '@/lib/service-error'

export class MissionService {
  async create(input: MissionCreateInput, userId: string) {
    try {
      const mission = await prisma.mission.create({
        data: {
          id: generateId(),
          userId,
          title: input.title,
          description: input.description,
          priority: input.priority || 'medium',
          difficulty: input.difficulty || 'medium',
          status: 'pending',
          deadline: input.deadline ? new Date(input.deadline) : null,
          estimatedTime: input.estimatedTime,
          campaignId: input.campaignId,
          category: input.category,
          tags: input.tags || [],
          dependencies: input.dependencies || [],
          remindAt: input.remindAt ? new Date(input.remindAt) : (input.remindBefore && input.deadline ? new Date(new Date(input.deadline).getTime() - input.remindBefore * 60000) : null),
          xpReward: calculateMissionXP(input.difficulty || 'medium'),
        },
        include: { subtasks: true, campaign: true },
      })

      await prisma.missionHistory.create({
        data: { missionId: mission.id, userId, action: 'created' },
      })

      if (mission.remindAt) {
        notificationService.create(
          userId,
          'reminder',
          `Reminder: ${input.title}`,
          `"${input.title}" is due`,
          { missionId: mission.id, remindAt: mission.remindAt.toISOString(), deadline: input.deadline }
        )
      }

      await eventBus.emit({
        type: 'MISSION_CREATED',
        payload: { missionId: mission.id, userId, data: mission },
      })

      return mission
    } catch (error) {
      handleServiceError(error, 'missionService.create')
    }
  }

  async update(id: string, input: MissionUpdateInput, userId: string) {
    try {
      const mission = await prisma.mission.update({
        where: { id, userId },
        data: {
          ...(input.title !== undefined && { title: input.title }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.priority !== undefined && { priority: input.priority }),
          ...(input.difficulty !== undefined && { difficulty: input.difficulty }),
          ...(input.status !== undefined && { status: input.status }),
          ...(input.deadline !== undefined && { deadline: input.deadline ? new Date(input.deadline) : null }),
          ...(input.estimatedTime !== undefined && { estimatedTime: input.estimatedTime }),
          ...(input.campaignId !== undefined && { campaignId: input.campaignId }),
          ...(input.category !== undefined && { category: input.category }),
          ...(input.tags !== undefined && { tags: input.tags }),
          ...(input.dependencies !== undefined && { dependencies: input.dependencies }),
          ...(input.progress !== undefined && { progress: input.progress }),
          ...(input.remindAt !== undefined && { remindAt: input.remindAt ? new Date(input.remindAt) : null }),
          ...(input.status === 'completed' && { completedAt: new Date(), progress: 100 }),
        },
        include: { subtasks: true, campaign: true },
      })

      await prisma.missionHistory.create({
        data: {
          missionId: id,
          userId,
          action: input.status === 'completed' ? 'completed' : 'updated',
          data: input as Prisma.InputJsonValue,
        },
      })

      if (input.status === 'completed') {
        await eventBus.emit({
          type: 'MISSION_COMPLETED',
          payload: { missionId: id, userId, data: mission },
        })
      } else {
        await eventBus.emit({
          type: 'MISSION_UPDATED',
          payload: { missionId: id, userId, data: { ...input, mission } },
        })
      }

      return mission
    } catch (error) {
      handleServiceError(error, 'missionService.update')
    }
  }

  async delete(id: string, userId: string) {
    try {
      await prisma.mission.delete({ where: { id, userId } })

      await eventBus.emit({
        type: 'MISSION_DELETED',
        payload: { missionId: id, userId },
      })
    } catch (error) {
      handleServiceError(error, 'missionService.delete')
    }
  }

  async archive(id: string, userId: string) {
    return this.update(id, { status: 'archived' }, userId)
  }

  async complete(id: string, userId: string) {
    return this.update(id, { status: 'completed', progress: 100 }, userId)
  }

  async getById(id: string, userId: string) {
    try {
      return await prisma.mission.findFirst({
        where: { id, userId },
        include: { subtasks: { orderBy: { order: 'asc' } }, campaign: true },
      })
    } catch (error) {
      handleServiceError(error, 'missionService.getById')
    }
  }

  async getByUser(userId: string, filters?: { status?: string; campaignId?: string; priority?: string }) {
    try {
      return await prisma.mission.findMany({
        where: { userId, ...filters },
        include: { subtasks: { orderBy: { order: 'asc' } }, campaign: true },
        orderBy: [{ priority: 'desc' }, { deadline: 'asc' }, { createdAt: 'desc' }],
      })
    } catch (error) {
      handleServiceError(error, 'missionService.getByUser')
    }
  }

  async getTodayMissions(userId: string) {
    try {
      const now = new Date()
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)

      return await prisma.mission.findMany({
        where: {
          userId,
          status: { in: ['pending', 'active'] },
          OR: [
            { deadline: { gte: startOfDay, lt: endOfDay } },
            { deadline: null, createdAt: { gte: startOfDay } },
          ],
        },
        include: { subtasks: true, campaign: true },
        orderBy: [{ priority: 'desc' }, { deadline: 'asc' }],
      })
    } catch (error) {
      handleServiceError(error, 'missionService.getTodayMissions')
    }
  }

  async getUpcomingMissions(userId: string, days: number = 7) {
    try {
      const now = new Date()
      const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)

      return await prisma.mission.findMany({
        where: {
          userId,
          status: { in: ['pending', 'active'] },
          deadline: { gte: now, lte: future },
        },
        include: { subtasks: true, campaign: true },
        orderBy: { deadline: 'asc' },
      })
    } catch (error) {
      handleServiceError(error, 'missionService.getUpcomingMissions')
    }
  }
}

export const missionService = new MissionService()
