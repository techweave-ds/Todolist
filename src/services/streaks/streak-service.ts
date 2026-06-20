import { prisma } from '@/lib/prisma'
import { eventBus } from '@/core/events'
import { startOfDay, differenceInCalendarDays } from 'date-fns'
import { handleServiceError } from '@/lib/service-error'

export class StreakService {
  async updateStreak(userId: string, type: 'daily' | 'weekly' = 'daily') {
    try {
      const today = startOfDay(new Date())

      const streak = await prisma.streak.upsert({
        where: { userId_streakType: { userId, streakType: type } },
        create: {
          userId,
          streakType: type,
          currentStreak: 1,
          longestStreak: 1,
          lastActivityDate: today,
        },
        update: {},
      })

      let newStreak = streak.currentStreak
      let longestStreak = streak.longestStreak

      if (streak.lastActivityDate) {
        const lastDate = startOfDay(new Date(streak.lastActivityDate))
        const daysDiff = differenceInCalendarDays(today, lastDate)

        if (daysDiff === 1) {
          newStreak = streak.currentStreak + 1
        } else if (daysDiff === 0) {
          newStreak = streak.currentStreak
        } else {
          newStreak = 1
        }
      } else {
        newStreak = 1
      }

      longestStreak = Math.max(longestStreak, newStreak)

      const updatedStreak = await prisma.streak.update({
        where: { userId_streakType: { userId, streakType: type } },
        data: { currentStreak: newStreak, longestStreak, lastActivityDate: today },
      })

      if (newStreak !== streak.currentStreak) {
        await eventBus.emit({
          type: 'STREAK_UPDATED',
          payload: {
            userId,
            currentStreak: newStreak,
            longestStreak,
            data: { previousStreak: streak.currentStreak },
          },
        })
      }

      return updatedStreak
    } catch (error) {
      handleServiceError(error, 'streakService.updateStreak')
    }
  }

  async getStreak(userId: string, type: 'daily' | 'weekly' = 'daily') {
    try {
      return await prisma.streak.findUnique({
        where: { userId_streakType: { userId, streakType: type } },
      })
    } catch (error) {
      handleServiceError(error, 'streakService.getStreak')
    }
  }

  async getStreaks(userId: string) {
    try {
      return prisma.streak.findMany({ where: { userId } })
    } catch (error) {
      handleServiceError(error, 'streakService.getStreaks')
    }
  }
}

export const streakService = new StreakService()
