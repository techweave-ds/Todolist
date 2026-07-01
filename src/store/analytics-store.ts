import { create } from 'zustand'
import {
  getDashboardStatsAction,
  getMissionCompletionRateAction,
  getFocusTimeAction,
  getCategoryDistributionAction,
} from '@/app/actions'

interface Stats {
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
  rate: number
  completed: number
  total: number
}

interface FocusData {
  totalMinutes: number
  totalSessions: number
  dailyData: Record<string, number>
  averagePerSession: number
}

interface CategoryEntry {
  completed: number
  total: number
}

type CategoryData = Record<string, CategoryEntry>

interface AnalyticsState {
  stats: Stats | null
  completionRate: CompletionRate | null
  focusData: FocusData | null
  categoryData: CategoryData
  isLoading: boolean
  error: string | null
  fetchAnalytics: (userId: string) => Promise<void>
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  stats: null,
  completionRate: null,
  focusData: null,
  categoryData: {},
  isLoading: false,
  error: null,

  fetchAnalytics: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const [stats, completionRate, focusData, categoryData] = await Promise.all([
        getDashboardStatsAction(userId) as Promise<Stats>,
        getMissionCompletionRateAction(userId) as Promise<CompletionRate>,
        getFocusTimeAction(userId) as Promise<FocusData>,
        getCategoryDistributionAction(userId) as Promise<CategoryData>,
      ])
      set({ stats, completionRate, focusData, categoryData, isLoading: false })
    } catch {
      set({ error: 'Failed to fetch analytics', isLoading: false })
    }
  },
}))
