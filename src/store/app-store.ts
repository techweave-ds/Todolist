import { create } from 'zustand'
import { getDashboardStatsAction } from '@/app/actions'
import { Notification } from '@/core/types/notification'
import { DEMO_USER_ID } from '@/lib/demo'

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

interface AppState {
  userId: string | null
  isDemo: boolean
  dashboardStats: DashboardStats | null
  isCommandPaletteOpen: boolean
  isDailyBriefingOpen: boolean
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: string | null
  setUserId: (userId: string | null) => void
  setDemoMode: () => void
  fetchDashboardStats: (userId: string) => Promise<void>
  toggleCommandPalette: () => void
  setDailyBriefingOpen: (open: boolean) => void
  setNotifications: (notifications: Notification[]) => void
  setUnreadCount: (count: number) => void
}

export const useAppStore = create<AppState>((set) => ({
  userId: null,
  isDemo: false,
  dashboardStats: null,
  isCommandPaletteOpen: false,
  isDailyBriefingOpen: false,
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  setUserId: (userId) => set({ userId, isDemo: false }),

  setDemoMode: () => set({ userId: DEMO_USER_ID, isDemo: true }),

  fetchDashboardStats: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const stats = await getDashboardStatsAction(userId)
      set({ dashboardStats: stats, isLoading: false })
    } catch {
      set({ error: 'Failed to fetch dashboard stats', isLoading: false })
    }
  },

  toggleCommandPalette: () => set(state => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),

  setDailyBriefingOpen: (open) => set({ isDailyBriefingOpen: open }),

  setNotifications: (notifications) => set({ notifications }),

  setUnreadCount: (count) => set({ unreadCount: count }),
}))
