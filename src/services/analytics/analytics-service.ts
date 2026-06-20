import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { handleServiceError } from '@/lib/service-error'

export class AnalyticsService {
  async trackEvent(userId: string, event: string, properties?: Record<string, unknown>) {
    try {
      return prisma.analyticsEvent.create({
        data: { userId, event, properties: properties as Prisma.InputJsonValue },
      })
    } catch (error) {
      handleServiceError(error, 'analyticsService.trackEvent')
    }
  }

  async getMissionCompletionRate(userId: string, days: number = 30) {
    try {
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      const missions = await prisma.mission.findMany({
        where: { userId, createdAt: { gte: since } },
        select: { status: true },
      })

      const total = missions.length
      const completed = missions.filter(m => m.status === 'completed').length

      return { total, completed, rate: total > 0 ? Math.round((completed / total) * 100) : 0 }
    } catch (error) {
      handleServiceError(error, 'analyticsService.getMissionCompletionRate')
    }
  }

  async getFocusTime(userId: string, days: number = 30) {
    try {
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      const sessions = await prisma.focusSession.findMany({
        where: { userId, startedAt: { gte: since }, completed: true },
        select: { actualDuration: true, startedAt: true },
      })

      const totalMinutes = sessions.reduce((sum, s) => sum + (s.actualDuration || 0), 0)
      const dailyData: Record<string, number> = {}

      sessions.forEach(s => {
        const key = new Date(s.startedAt).toISOString().split('T')[0]
        dailyData[key] = (dailyData[key] || 0) + (s.actualDuration || 0)
      })

      return {
        totalMinutes,
        totalSessions: sessions.length,
        averagePerSession: sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0,
        dailyData,
      }
    } catch (error) {
      handleServiceError(error, 'analyticsService.getFocusTime')
    }
  }

  async getXPGrowth(userId: string, days: number = 30) {
    try {
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      const transactions = await prisma.xPTransaction.findMany({
        where: { userId, createdAt: { gte: since } },
        orderBy: { createdAt: 'asc' },
      })

      let runningTotal = 0
      return transactions.map(t => {
        runningTotal += t.amount
        return { date: t.createdAt.toISOString().split('T')[0], amount: t.amount, total: runningTotal }
      })
    } catch (error) {
      handleServiceError(error, 'analyticsService.getXPGrowth')
    }
  }

  async getCategoryDistribution(userId: string) {
    try {
      const missions = await prisma.mission.findMany({
        where: { userId, category: { not: null } },
        select: { category: true, status: true },
      })

      const distribution: Record<string, { total: number; completed: number }> = {}
      missions.forEach(m => {
        const cat = m.category || 'uncategorized'
        if (!distribution[cat]) distribution[cat] = { total: 0, completed: 0 }
        distribution[cat].total++
        if (m.status === 'completed') distribution[cat].completed++
      })

      return distribution
    } catch (error) {
      handleServiceError(error, 'analyticsService.getCategoryDistribution')
    }
  }

  async getPeakProductivityHours(userId: string) {
    try {
      const missions = await prisma.mission.findMany({
        where: { userId, completedAt: { not: null } },
        select: { completedAt: true },
      })

      const hourlyDistribution: Record<number, number> = {}
      missions.forEach(m => {
        if (m.completedAt) {
          const hour = new Date(m.completedAt).getHours()
          hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + 1
        }
      })

      return hourlyDistribution
    } catch (error) {
      handleServiceError(error, 'analyticsService.getPeakProductivityHours')
    }
  }

  async getDashboardStats(userId: string) {
    try {
      const progress = await prisma.userProgress.findUnique({ where: { userId } })
      const streaks = await prisma.streak.findMany({ where: { userId } })
      const todayMissions = await prisma.mission.findMany({
        where: {
          userId,
          status: { in: ['pending', 'active'] },
          deadline: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(24, 0, 0, 0)),
          },
        },
      })
      const focusStats = await prisma.focusStatistic.findUnique({ where: { userId } })
      const recentAchievements = await prisma.userAchievement.findMany({
        where: { userId, unlocked: true },
        include: { achievement: true },
        orderBy: { unlockedAt: 'desc' },
        take: 5,
      })
      const campaigns = await prisma.campaign.findMany({
        where: { userId },
        include: { missions: { select: { status: true } } },
      })

      return {
        level: progress?.level || 1,
        totalXP: progress?.totalXP || 0,
        currentXP: progress?.currentXP || 0,
        xpToNextLevel: progress?.xpToNextLevel || 100,
        totalMissionsCompleted: progress?.totalMissionsCompleted || 0,
        dailyStreak: streaks.find(s => s.streakType === 'daily')?.currentStreak || 0,
        longestStreak: streaks.find(s => s.streakType === 'daily')?.longestStreak || 0,
        todayMissions: todayMissions.length,
        todayCompleted: todayMissions.filter(m => m.status === 'completed').length,
        focusMinutes: focusStats?.totalMinutes || 0,
        focusSessions: focusStats?.totalSessions || 0,
        focusScore: focusStats?.averageScore || 0,
        recentAchievements: recentAchievements.map(a => ({
          key: a.achievement.key,
          title: a.achievement.title,
          emoji: a.achievement.emoji,
          rarity: a.achievement.rarity,
        })),
        activeCampaigns: campaigns.filter(c => c.status === 'active').length,
        campaignProgress: campaigns.map(c => ({
          id: c.id,
          title: c.title,
          emoji: c.emoji,
          total: c.missions.length,
          completed: c.missions.filter(m => m.status === 'completed').length,
        })),
      }
    } catch (error) {
      handleServiceError(error, 'analyticsService.getDashboardStats')
    }
  }
}

export const analyticsService = new AnalyticsService()
