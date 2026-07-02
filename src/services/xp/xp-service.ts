import { prisma } from '@/lib/prisma'
import { eventBus } from '@/core/events'
import { XP, LEVELS } from '@/core/constants'
import { MissionDifficulty, XPCalculation } from '@/core/types'
import { handleServiceError } from '@/lib/service-error'

const DIFFICULTY_XP: Record<MissionDifficulty, number> = {
  easy: XP.EASY,
  medium: XP.MEDIUM,
  hard: XP.HARD,
  legendary: XP.LEGENDARY,
}

export function calculateMissionXP(difficulty: MissionDifficulty): number {
  return DIFFICULTY_XP[difficulty]
}

export function calculateTotalXP(difficulty: MissionDifficulty, streak: number = 0, focusBonus: boolean = false, campaignBonus: boolean = false): XPCalculation {
  const baseXP = DIFFICULTY_XP[difficulty]
  const streakMultiplier = 1 + (streak * XP.STREAK_MULTIPLIER)
  const streakBonus = Math.round(baseXP * (streakMultiplier - 1))
  const focusBonusAmount = focusBonus ? Math.round(baseXP * XP.FOCUS_BONUS) : 0
  const campaignBonusAmount = campaignBonus ? Math.round(baseXP * XP.CAMPAIGN_BONUS) : 0
  const multiplier = streakMultiplier + (focusBonus ? XP.FOCUS_BONUS : 0) + (campaignBonus ? XP.CAMPAIGN_BONUS : 0)
  const totalXP = Math.round(baseXP * multiplier)

  return {
    baseXP,
    multiplier,
    streakBonus,
    focusBonus: focusBonusAmount,
    campaignBonus: campaignBonusAmount,
    totalXP,
  }
}

export function calculateLevel(totalXP: number) {
  let level = 1
  let xpRequired: number = LEVELS.BASE_XP
  let accumulated = 0

  while (totalXP >= accumulated + xpRequired && level < LEVELS.MAX_LEVEL) {
    accumulated += xpRequired
    level++
    xpRequired = Math.floor(LEVELS.BASE_XP * Math.pow(LEVELS.SCALE_FACTOR, level - 1))
  }

  return {
    level,
    currentXP: totalXP - accumulated,
    totalXP,
    xpToNextLevel: xpRequired,
    progress: Math.round(((totalXP - accumulated) / xpRequired) * 100),
  }
}

export class XPService {
  async awardXP(userId: string, amount: number, reason: string, referenceId?: string) {
    try {
      return await prisma.$transaction(async (tx) => {
        const transaction = await tx.xPTransaction.create({
          data: { userId, amount, reason, referenceId },
        })

        const totalXP = await tx.xPTransaction.aggregate({
          where: { userId },
          _sum: { amount: true },
        })

        const totalXPAmount = totalXP._sum.amount || 0
        const levelInfo = calculateLevel(totalXPAmount)

        const previousProgress = await tx.userProgress.findUnique({ where: { userId } })
        const previousLevel = previousProgress?.level || 1

        await tx.userProgress.upsert({
          where: { userId },
          create: {
            userId,
            totalXP: totalXPAmount,
            currentXP: levelInfo.currentXP,
            level: levelInfo.level,
            xpToNextLevel: levelInfo.xpToNextLevel,
          },
          update: {
            totalXP: totalXPAmount,
            currentXP: levelInfo.currentXP,
            level: levelInfo.level,
            xpToNextLevel: levelInfo.xpToNextLevel,
          },
        })

        await eventBus.emit({
          type: 'XP_GAINED',
          payload: {
            userId, amount,
            totalXP: totalXPAmount,
            level: levelInfo.level,
            data: { reason, referenceId },
          },
        })

        if (levelInfo.level > previousLevel) {
          await eventBus.emit({
            type: 'LEVEL_UP',
            payload: {
              userId,
              amount: levelInfo.level - previousLevel,
              totalXP: totalXPAmount,
              level: levelInfo.level,
              data: { previousLevel, newLevel: levelInfo.level },
            },
          })
        }

        return { transaction, levelInfo, totalXP: totalXPAmount, previousLevel }
      })
    } catch (error) {
      handleServiceError(error, 'xpService.awardXP')
    }
  }

  async getXPHistory(userId: string, limit: number = 50) {
    try {
      return await prisma.xPTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      })
    } catch (error) {
      handleServiceError(error, 'xpService.getXPHistory')
    }
  }

  async getLevelInfo(userId: string) {
    try {
      const progress = await prisma.userProgress.findUnique({ where: { userId } })
      if (!progress) return calculateLevel(0)
      return calculateLevel(progress.totalXP)
    } catch (error) {
      handleServiceError(error, 'xpService.getLevelInfo')
    }
  }
}

export const xpService = new XPService()
