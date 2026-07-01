import { create } from 'zustand'
import { calculateLevel } from '@/lib/utils'
import { getLevelInfoAction, getXPHistoryAction } from '@/app/actions'

interface XpTransaction {
  id: string
  amount: number
  reason: string
  createdAt: string | Date
}

interface XPState {
  level: number
  currentXP: number
  xpToNextLevel: number
  progress: number
  totalXP: number
  xpHistory: XpTransaction[]
  isLoading: boolean
  error: string | null
  fetchLevelInfo: (userId: string) => Promise<void>
  fetchXPHistory: (userId: string) => Promise<void>
}

export const useXPStore = create<XPState>((set) => ({
  level: 1,
  currentXP: 0,
  xpToNextLevel: 100,
  progress: 0,
  totalXP: 0,
  xpHistory: [],
  isLoading: false,
  error: null,

  fetchLevelInfo: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const info = await getLevelInfoAction(userId) as any
      set({
        level: info.currentLevel,
        currentXP: info.currentXP,
        xpToNextLevel: info.xpToNextLevel,
        progress: info.progress,
        totalXP: info.totalXP,
        isLoading: false,
      })
    } catch {
      set({ error: 'Failed to fetch level info', isLoading: false })
    }
  },

  fetchXPHistory: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const history = await getXPHistoryAction(userId) as XpTransaction[]
      set({ xpHistory: history, isLoading: false })
    } catch {
      set({ error: 'Failed to fetch XP history', isLoading: false })
    }
  },
}))
