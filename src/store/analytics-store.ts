import { create } from 'zustand'
import { analyticsService } from '@/services/analytics/analytics-service'

interface DashboardStats {
  level: number
  totalXP: number
  currentXP: number
  xpToNextLevel: number
  totalMissionsCompleted: number
  dailyStreak: number
  longestStreak: number
  todayMissions: number
  todayCompleted: number
  focusMinutes: number
  focusSessions: number
  focusScore: number
  recentAchievements: { key: string; title: string; emoji: string | null; rarity: string }[]
  activeCampaigns: number
  campaignProgress: { id: string; title: string; emoji: string | null; total: number; completed: number }[]
}

interface CompletionRate {
  total: number
  completed: number
  rate: number
}

interface FocusData {
  totalMinutes: number
  totalSessions: number
  averagePerSession: number
  dailyData: Record<string, number>
}

interface AnalyticsState {
  stats: DashboardStats | null
  completionRate: CompletionRate | null
  focusData: FocusData | null
  categoryData: Record<string, { total: number; completed: number }> | null
  isLoading: boolean
  fetchAnalytics: (userId: string) => Promise<void>
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  stats: null,
  completionRate: null,
  focusData: null,
  categoryData: null,
  isLoading: false,

  fetchAnalytics: async (userId: string) => {
    set({ isLoading: true })
    try {
      const [stats, completionRate, focusData, categoryData] = await Promise.all([
        analyticsService.getDashboardStats(userId),
        analyticsService.getMissionCompletionRate(userId),
        analyticsService.getFocusTime(userId),
        analyticsService.getCategoryDistribution(userId),
      ])
      set({ stats, completionRate, focusData, categoryData, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },
}))
