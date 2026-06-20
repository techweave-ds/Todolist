import { prisma } from '@/lib/prisma'
import { eventBus } from '@/core/events'
import { FocusSessionInput } from '@/core/types'
import { generateId } from '@/lib/utils'
import { handleServiceError } from '@/lib/service-error'

export class FocusService {
  async startSession(input: FocusSessionInput, userId: string) {
    try {
      const session = await prisma.focusSession.create({
        data: {
          id: generateId(),
          userId,
          type: input.type,
          duration: input.duration,
          environment: input.environment,
          startedAt: new Date(),
        },
      })

      await eventBus.emit({
        type: 'FOCUS_STARTED',
        payload: {
          userId,
          sessionId: session.id,
          duration: input.duration,
          completed: false,
          data: { type: input.type, environment: input.environment },
        },
      })

      return session
    } catch (error) {
      handleServiceError(error, 'focusService.startSession')
    }
  }

  async endSession(sessionId: string, userId: string, actualDuration: number, completed: boolean, distractions?: number) {
    try {
      return await prisma.$transaction(async (tx) => {
        const session = await tx.focusSession.update({
          where: { id: sessionId, userId },
          data: {
            actualDuration,
            completed,
            endedAt: new Date(),
            distractions: distractions || 0,
            score: this.calculateFocusScore(actualDuration, distractions || 0),
          },
        })

        const existingStats = await tx.focusStatistic.findUnique({ where: { userId } })

        if (!existingStats) {
          await tx.focusStatistic.create({
            data: {
              userId,
              totalSessions: 1,
              totalMinutes: actualDuration,
              averageScore: session.score || 0,
              longestSession: actualDuration,
              currentStreak: 1,
              bestStreak: 1,
              weeklyMinutes: actualDuration,
              monthlyMinutes: actualDuration,
            },
          })
        } else {
          await tx.focusStatistic.update({
            where: { userId },
            data: {
              totalSessions: { increment: 1 },
              totalMinutes: { increment: actualDuration },
              weeklyMinutes: { increment: actualDuration },
              monthlyMinutes: { increment: actualDuration },
            },
          })

          const allSessions = await tx.focusSession.findMany({
            where: { userId, completed: true },
            select: { score: true },
          })
          const avgScore = allSessions.reduce((sum, s) => sum + (s.score || 0), 0) / allSessions.length
          const longest = await tx.focusSession.findFirst({
            where: { userId, completed: true },
            orderBy: { actualDuration: 'desc' },
            select: { actualDuration: true },
          })

          await tx.focusStatistic.update({
            where: { userId },
            data: {
              averageScore: Math.round(avgScore * 10) / 10,
              longestSession: longest?.actualDuration || actualDuration,
            },
          })
        }

        await eventBus.emit({
          type: 'FOCUS_ENDED',
          payload: {
            userId,
            sessionId,
            duration: actualDuration,
            completed,
            data: { score: session.score, distractions },
          },
        })

        return session
      })
    } catch (error) {
      handleServiceError(error, 'focusService.endSession')
    }
  }

  private calculateFocusScore(duration: number, distractions: number): number {
    const baseScore = 100
    const distractionPenalty = distractions * 10
    return Math.max(0, baseScore - distractionPenalty)
  }

  async getSessionHistory(userId: string, limit: number = 20) {
    try {
      return prisma.focusSession.findMany({
        where: { userId },
        orderBy: { startedAt: 'desc' },
        take: limit,
      })
    } catch (error) {
      handleServiceError(error, 'focusService.getSessionHistory')
    }
  }

  async getStatistics(userId: string) {
    try {
      return prisma.focusStatistic.findUnique({ where: { userId } })
    } catch (error) {
      handleServiceError(error, 'focusService.getStatistics')
    }
  }

  async getWeeklyData(userId: string) {
    try {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const sessions = await prisma.focusSession.findMany({
        where: { userId, startedAt: { gte: weekAgo } },
        orderBy: { startedAt: 'asc' },
      })

      const dailyData: Record<string, { date: string; minutes: number; sessions: number }> = {}
      for (let i = 0; i < 7; i++) {
        const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        const key = d.toISOString().split('T')[0]
        dailyData[key] = { date: key, minutes: 0, sessions: 0 }
      }

      sessions.forEach(s => {
        const key = new Date(s.startedAt).toISOString().split('T')[0]
        if (dailyData[key]) {
          dailyData[key].minutes += s.actualDuration || 0
          dailyData[key].sessions += 1
        }
      })

      return Object.values(dailyData).reverse()
    } catch (error) {
      handleServiceError(error, 'focusService.getWeeklyData')
    }
  }
}

export const focusService = new FocusService()
