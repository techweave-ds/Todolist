import { create } from 'zustand'
import { getUserAchievementsAction } from '@/app/actions'

interface UserAchievement {
  id: string
  userId: string
  achievementId: string
  progress: number
  unlockedAt: string | Date | null
  achievement?: {
    id: string
    key: string
    title: string
    description: string | null
    emoji: string | null
    rarity: string
    xpReward: number
  }
}

interface AchievementState {
  achievements: UserAchievement[]
  isLoading: boolean
  error: string | null
  fetchAchievements: (userId: string) => Promise<void>
}

export const useAchievementStore = create<AchievementState>((set) => ({
  achievements: [],
  isLoading: false,
  error: null,

  fetchAchievements: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const achievements = await getUserAchievementsAction(userId) as UserAchievement[]
      set({ achievements, isLoading: false })
    } catch {
      set({ error: 'Failed to fetch achievements', isLoading: false })
    }
  },
}))
