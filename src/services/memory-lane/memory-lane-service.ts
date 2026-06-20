import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { MemoryLaneType } from '@/core/types'
import { handleServiceError } from '@/lib/service-error'

export class MemoryLaneService {
  async addEntry(userId: string, type: MemoryLaneType, title: string, description?: string, metadata?: Record<string, unknown>, significance: number = 1) {
    try {
      return prisma.memoryLane.create({
        data: {
          userId, type, title, description,
          metadata: metadata as Prisma.InputJsonValue,
          date: new Date(),
          significance,
        },
      })
    } catch (error) {
      handleServiceError(error, 'memoryLaneService.addEntry')
    }
  }

  async getEntries(userId: string, limit: number = 50) {
    try {
      return prisma.memoryLane.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: limit,
      })
    } catch (error) {
      handleServiceError(error, 'memoryLaneService.getEntries')
    }
  }

  async getEntriesByType(userId: string, type: MemoryLaneType) {
    try {
      return prisma.memoryLane.findMany({
        where: { userId, type },
        orderBy: { date: 'desc' },
      })
    } catch (error) {
      handleServiceError(error, 'memoryLaneService.getEntriesByType')
    }
  }

  async getTimeline(userId: string) {
    try {
      const entries = await prisma.memoryLane.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 100,
      })

      const grouped: Record<string, typeof entries> = {}
      entries.forEach(entry => {
        const key = new Date(entry.date).toISOString().split('T')[0]
        if (!grouped[key]) grouped[key] = []
        grouped[key].push(entry)
      })

      return Object.entries(grouped).map(([date, items]) => ({
        date,
        items,
        significance: Math.max(...items.map(i => i.significance)),
      }))
    } catch (error) {
      handleServiceError(error, 'memoryLaneService.getTimeline')
    }
  }

  async getAnnualWrapped(userId: string, year: number = new Date().getFullYear()) {
    try {
      const startOfYear = new Date(year, 0, 1)
      const endOfYear = new Date(year + 1, 0, 1)

      const entries = await prisma.memoryLane.findMany({
        where: { userId, date: { gte: startOfYear, lt: endOfYear } },
      })

      const completedMissions = await prisma.mission.count({
        where: { userId, status: 'completed', completedAt: { gte: startOfYear, lt: endOfYear } },
      })

      const xpEarned = await prisma.xPTransaction.aggregate({
        where: { userId, createdAt: { gte: startOfYear, lt: endOfYear } },
        _sum: { amount: true },
      })

      const focusMinutes = await prisma.focusSession.aggregate({
        where: { userId, startedAt: { gte: startOfYear, lt: endOfYear }, completed: true },
        _sum: { actualDuration: true },
      })

      const achievements = entries.filter(e => e.type === 'achievement')
      const campaigns = entries.filter(e => e.type === 'campaign_complete')

      return {
        year,
        totalMissions: completedMissions,
        totalXP: xpEarned._sum.amount || 0,
        totalFocusMinutes: focusMinutes._sum.actualDuration || 0,
        achievements,
        campaigns,
        topMoments: entries.filter(e => e.significance >= 8),
      }
    } catch (error) {
      handleServiceError(error, 'memoryLaneService.getAnnualWrapped')
    }
  }
}

export const memoryLaneService = new MemoryLaneService()
