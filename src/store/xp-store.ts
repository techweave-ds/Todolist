import { create } from 'zustand'
import { calculateLevel } from '@/lib/utils'
import { xpService } from '@/services/xp/xp-service'

interface XPState {
  totalXP: number
  level: number
  currentXP: number
  xpToNextLevel: number
  progress: number
  recentTransactions: any[]
  isLoading: boolean
  fetchLevelInfo: (userId: string) => Promise<void>
  fetchTransactions: (userId: string) => Promise<void>
  updateXP: (totalXP: number) => void
  setRecentTransactions: (transactions: any[]) => void
}

export const useXPStore = create<XPState>((set) => ({
  totalXP: 0,
  level: 1,
  currentXP: 0,
  xpToNextLevel: 100,
  progress: 0,
  recentTransactions: [],
  isLoading: false,

  fetchLevelInfo: async (userId: string) => {
    set({ isLoading: true })
    try {
      const levelInfo = await xpService.getLevelInfo(userId)
      set({
        totalXP: levelInfo.totalXP,
        level: levelInfo.level,
        currentXP: levelInfo.currentXP,
        xpToNextLevel: levelInfo.xpToNextLevel,
        progress: Math.round((levelInfo.currentXP / levelInfo.xpToNextLevel) * 100),
        isLoading: false,
      })
    } catch {
      set({ isLoading: false })
    }
  },

  fetchTransactions: async (userId: string) => {
    try {
      const transactions = await xpService.getXPHistory(userId, 20)
      set({ recentTransactions: transactions })
    } catch {
      // silent
    }
  },

  updateXP: (totalXP: number) => {
    const levelInfo = calculateLevel(totalXP)
    set({
      totalXP,
      level: levelInfo.level,
      currentXP: levelInfo.currentXP,
      xpToNextLevel: levelInfo.xpToNextLevel,
      progress: Math.round((levelInfo.currentXP / levelInfo.xpToNextLevel) * 100),
    })
  },

  setRecentTransactions: (transactions) => set({ recentTransactions: transactions }),
}))
