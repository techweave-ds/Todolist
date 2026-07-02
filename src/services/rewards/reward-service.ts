import { prisma } from '@/lib/prisma'
import { eventBus } from '@/core/events'
import { xpService } from '@/services/xp/xp-service'
import { achievementService } from '@/services/achievements/achievement-service'
import { streakService } from '@/services/streaks/streak-service'
import { notificationService } from '@/services/notifications/notification-service'
import { memoryLaneService } from '@/services/memory-lane/memory-lane-service'
import { calculateTotalXP } from '@/services/xp/xp-service'
import { MissionDifficulty } from '@/core/types'
import { handleServiceError } from '@/lib/service-error'

export class RewardService {
  async processMissionCompletion(userId: string, missionId: string, difficulty: MissionDifficulty, streakDays: number = 0, hasFocusBonus: boolean = false, hasCampaignBonus: boolean = false) {
    try {
      const xpCalculation = calculateTotalXP(difficulty, streakDays, hasFocusBonus, hasCampaignBonus)
      const xpResult = await xpService.awardXP(userId, xpCalculation.totalXP, 'mission_completed', missionId)
      const streakResult = await streakService.updateStreak(userId)
      const achievementResult = await achievementService.checkAndUnlock(userId)

      const leveledUp = xpResult.levelInfo.level > xpResult.previousLevel
      if (leveledUp) {
        await notificationService.create(userId, 'system', `Level ${xpResult.levelInfo.level} Reached!`, `You advanced to level ${xpResult.levelInfo.level}`)
        await memoryLaneService.addEntry(userId, 'milestone', `Level ${xpResult.levelInfo.level} Reached!`, `Advanced to level ${xpResult.levelInfo.level}`, { level: xpResult.levelInfo.level }, 8)
      }
      if (achievementResult) {
        await notificationService.create(userId, 'achievement', 'Achievement Unlocked!', `Unlocked: ${achievementResult.title}`, { key: achievementResult.key })
        await memoryLaneService.addEntry(userId, 'achievement', `Achievement: ${achievementResult.title}`, 'Unlocked a new achievement', { key: achievementResult.key }, 8)
      }

      await prisma.userProgress.update({
        where: { userId },
        data: { totalMissionsCompleted: { increment: 1 } },
      })

      await eventBus.emit({
        type: 'REWARD_CAPSULE_OPENED',
        payload: { userId, data: { missionId, xpCalculation } },
      })

      return {
        xpCalculation,
        rewardEvents: {
          leveledUp,
          newLevel: xpResult.levelInfo.level,
          streakChanged: streakResult.changed,
          currentStreak: streakResult.currentStreak,
          longestStreak: streakResult.longestStreak,
          achievementUnlocked: !!achievementResult,
          achievementKey: achievementResult?.key,
          achievementTitle: achievementResult?.title,
        },
      }
    } catch (error) {
      handleServiceError(error, 'rewardService.processMissionCompletion')
    }
  }

  async getRewardSummary(userId: string) {
    try {
      const progress = await prisma.userProgress.findUnique({ where: { userId } })
      const streaks = await prisma.streak.findMany({ where: { userId } })
      const achievements = await prisma.userAchievement.findMany({
        where: { userId, unlocked: true },
        include: { achievement: true },
      })
      const recentXP = await prisma.xPTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      })

      return { progress, streaks, achievements, recentXP }
    } catch (error) {
      handleServiceError(error, 'rewardService.getRewardSummary')
    }
  }
}

export const rewardService = new RewardService()
