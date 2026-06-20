import { prisma } from '@/lib/prisma'
import { eventBus } from '@/core/events'
import { ACHIEVEMENTS } from '@/core/constants'
import { xpService } from '@/services/xp/xp-service'
import { handleServiceError } from '@/lib/service-error'

export class AchievementService {
  async checkAndUnlock(userId: string) {
    try {
      const progress = await prisma.userProgress.findUnique({ where: { userId } })
      const streaks = await prisma.streak.findMany({ where: { userId } })
      const achievements = await prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: true },
      })
      const unlockedKeys = achievements.filter(a => a.unlocked).map(a => a.achievement.key)
      const focusStats = await prisma.focusStatistic.findUnique({ where: { userId } })
      const campaigns = await prisma.campaign.findMany({ where: { userId } })

      const allAchievements = Object.values(ACHIEVEMENTS)

      for (const def of allAchievements) {
        if (unlockedKeys.includes(def.key)) continue

        let shouldUnlock = false

        if (def.key === 'first_mission' && (progress?.totalMissionsCompleted || 0) >= 1) shouldUnlock = true
        if (def.key === 'streak_7') {
          const dailyStreak = streaks.find(s => s.streakType === 'daily')
          if (dailyStreak && dailyStreak.currentStreak >= 7) shouldUnlock = true
        }
        if (def.key === 'streak_30') {
          const dailyStreak = streaks.find(s => s.streakType === 'daily')
          if (dailyStreak && dailyStreak.currentStreak >= 30) shouldUnlock = true
        }
        if (def.key === 'missions_10' && (progress?.totalMissionsCompleted || 0) >= 10) shouldUnlock = true
        if (def.key === 'missions_50' && (progress?.totalMissionsCompleted || 0) >= 50) shouldUnlock = true
        if (def.key === 'missions_100' && (progress?.totalMissionsCompleted || 0) >= 100) shouldUnlock = true
        if (def.key === 'campaign_finisher' && campaigns.filter(c => c.status === 'completed').length >= 1) shouldUnlock = true
        if (def.key === 'focus_master' && (focusStats?.totalSessions || 0) >= 10) shouldUnlock = true
        if (def.key === 'focus_100' && (focusStats?.totalSessions || 0) >= 100) shouldUnlock = true
        if (def.key === 'level_5' && (progress?.level || 0) >= 5) shouldUnlock = true
        if (def.key === 'level_10' && (progress?.level || 0) >= 10) shouldUnlock = true
        if (def.key === 'level_25' && (progress?.level || 0) >= 25) shouldUnlock = true

        if (shouldUnlock) {
          await this.unlockAchievement(userId, def.key)
        } else {
          const dbAchievement = await prisma.achievement.findUnique({ where: { key: def.key } })
          if (dbAchievement) {
            await prisma.userAchievement.upsert({
              where: { userId_achievementId: { userId, achievementId: dbAchievement.id } },
              create: { userId, achievementId: dbAchievement.id, progress: this.calculateProgress(def.key, progress, streaks, campaigns, focusStats) },
              update: { progress: this.calculateProgress(def.key, progress, streaks, campaigns, focusStats) },
            })
          }
        }
      }
    } catch (error) {
      handleServiceError(error, 'achievementService.checkAndUnlock')
    }
  }

  private calculateProgress(key: string, progress: any, streaks: any[], campaigns: any[], focusStats: any): number {
    switch (key) {
      case 'first_mission': return Math.min(100, (progress?.totalMissionsCompleted || 0) * 100)
      case 'streak_7': return Math.min(100, ((streaks.find(s => s.streakType === 'daily')?.currentStreak || 0) / 7) * 100)
      case 'streak_30': return Math.min(100, ((streaks.find(s => s.streakType === 'daily')?.currentStreak || 0) / 30) * 100)
      case 'missions_10': return Math.min(100, ((progress?.totalMissionsCompleted || 0) / 10) * 100)
      case 'missions_50': return Math.min(100, ((progress?.totalMissionsCompleted || 0) / 50) * 100)
      case 'missions_100': return Math.min(100, ((progress?.totalMissionsCompleted || 0) / 100) * 100)
      case 'campaign_finisher': return Math.min(100, campaigns.filter(c => c.status === 'completed').length * 100)
      case 'focus_master': return Math.min(100, ((focusStats?.totalSessions || 0) / 10) * 100)
      case 'focus_100': return Math.min(100, ((focusStats?.totalSessions || 0) / 100) * 100)
      case 'level_5': return Math.min(100, ((progress?.level || 0) / 5) * 100)
      case 'level_10': return Math.min(100, ((progress?.level || 0) / 10) * 100)
      case 'level_25': return Math.min(100, ((progress?.level || 0) / 25) * 100)
      default: return 0
    }
  }

  async unlockAchievement(userId: string, achievementKey: string) {
    try {
      const achievement = await prisma.achievement.upsert({
        where: { key: achievementKey },
        create: {
          key: achievementKey,
          title: ACHIEVEMENTS[achievementKey as keyof typeof ACHIEVEMENTS]?.title || achievementKey,
          description: ACHIEVEMENTS[achievementKey as keyof typeof ACHIEVEMENTS]?.description || '',
          emoji: ACHIEVEMENTS[achievementKey as keyof typeof ACHIEVEMENTS]?.emoji || '🏅',
          rarity: ACHIEVEMENTS[achievementKey as keyof typeof ACHIEVEMENTS]?.rarity || 'common',
          xpReward: ACHIEVEMENTS[achievementKey as keyof typeof ACHIEVEMENTS]?.xpReward || 0,
        },
        update: {},
      })

      await prisma.userAchievement.upsert({
        where: { userId_achievementId: { userId, achievementId: achievement.id } },
        create: { userId, achievementId: achievement.id, unlocked: true, unlockedAt: new Date(), progress: 100 },
        update: { unlocked: true, unlockedAt: new Date(), progress: 100 },
      })

      if (achievement.xpReward > 0) {
        await xpService.awardXP(userId, achievement.xpReward, 'achievement_unlocked', achievement.id)
      }

      await eventBus.emit({
        type: 'ACHIEVEMENT_UNLOCKED',
        payload: {
          userId,
          achievementKey: achievement.key,
          achievementTitle: achievement.title,
          data: { achievement },
        },
      })

      return achievement
    } catch (error) {
      handleServiceError(error, 'achievementService.unlockAchievement')
    }
  }

  async getUserAchievements(userId: string) {
    try {
      return prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: true },
        orderBy: [{ unlocked: 'desc' }, { progress: 'desc' }],
      })
    } catch (error) {
      handleServiceError(error, 'achievementService.getUserAchievements')
    }
  }
}

export const achievementService = new AchievementService()
