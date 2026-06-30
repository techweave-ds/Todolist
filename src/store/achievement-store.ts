import { create } from 'zustand'
import { UserAchievement } from '@/core/types/achievement'
import { achievementService } from '@/services/achievements/achievement-service'

interface AchievementState {
  achievements: UserAchievement[]
  recentUnlocks: UserAchievement[]
  isLoading: boolean
  error: string | null
  fetchAchievements: (userId: string) => Promise<void>
}

export const useAchievementStore = create<AchievementState>((set) => ({
  achievements: [],
  recentUnlocks: [],
  isLoading: false,
  error: null,

  fetchAchievements: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const achievements = await achievementService.getUserAchievements(userId)
      set({
        achievements,
        recentUnlocks: achievements.filter(a => a.unlockedAt).slice(0, 5),
        isLoading: false,
      })
    } catch (error) {
      set({ error: 'Failed to fetch achievements', isLoading: false })
    }
  },
}))
