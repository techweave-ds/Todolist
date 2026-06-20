import { create } from 'zustand'
import { analyticsService } from '@/services/analytics/analytics-service'

interface AnalyticsState {
  stats: any | null
  completionRate: any | null
  focusData: any | null
  categoryData: any | null
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
