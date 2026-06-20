import { create } from 'zustand'
import { analyticsService } from '@/services/analytics/analytics-service'
import { DEMO_USER_ID } from '@/lib/demo'

interface AppState {
  userId: string | null
  isDemo: boolean
  dashboardStats: any | null
  isCommandPaletteOpen: boolean
  isDailyBriefingOpen: boolean
  notifications: any[]
  unreadCount: number
  isLoading: boolean
  error: string | null
  setUserId: (userId: string | null) => void
  setDemoMode: () => void
  fetchDashboardStats: (userId: string) => Promise<void>
  toggleCommandPalette: () => void
  setDailyBriefingOpen: (open: boolean) => void
  setNotifications: (notifications: any[]) => void
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
      const stats = await analyticsService.getDashboardStats(userId)
      set({ dashboardStats: stats, isLoading: false })
    } catch (error) {
      set({ error: 'Failed to fetch dashboard stats', isLoading: false })
    }
  },

  toggleCommandPalette: () => set(state => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),

  setDailyBriefingOpen: (open) => set({ isDailyBriefingOpen: open }),

  setNotifications: (notifications) => set({ notifications }),

  setUnreadCount: (count) => set({ unreadCount: count }),
}))
