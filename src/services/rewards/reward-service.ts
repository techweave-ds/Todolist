import { prisma } from '@/lib/prisma'
import { eventBus } from '@/core/events'
import { xpService } from '@/services/xp/xp-service'
import { achievementService } from '@/services/achievements/achievement-service'
import { streakService } from '@/services/streaks/streak-service'
import { calculateTotalXP } from '@/services/xp/xp-service'
import { MissionDifficulty } from '@/core/types'
import { handleServiceError } from '@/lib/service-error'

export class RewardService {
  async processMissionCompletion(userId: string, missionId: string, difficulty: MissionDifficulty, streakDays: number = 0, hasFocusBonus: boolean = false, hasCampaignBonus: boolean = false) {
    try {
      const xpCalculation = calculateTotalXP(difficulty, streakDays, hasFocusBonus, hasCampaignBonus)

      await xpService.awardXP(userId, xpCalculation.totalXP, 'mission_completed', missionId)
      await streakService.updateStreak(userId)
      await achievementService.checkAndUnlock(userId)

      await prisma.userProgress.update({
        where: { userId },
        data: { totalMissionsCompleted: { increment: 1 } },
      })

      await eventBus.emit({
        type: 'REWARD_CAPSULE_OPENED',
        payload: { userId, data: { missionId, xpCalculation } },
      })

      return xpCalculation
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
