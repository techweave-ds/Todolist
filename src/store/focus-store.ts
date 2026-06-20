import { create } from 'zustand'
import { FocusSessionInput } from '@/core/types'
import { focusService } from '@/services/focus/focus-service'

interface FocusState {
  isActive: boolean
  currentSession: any | null
  timeRemaining: number
  sessions: any[]
  statistics: any | null
  weeklyData: any[]
  isLoading: boolean
  error: string | null
  startSession: (input: FocusSessionInput, userId: string) => Promise<void>
  endSession: (sessionId: string, userId: string, actualDuration: number, completed: boolean, distractions?: number) => Promise<void>
  fetchHistory: (userId: string) => Promise<void>
  fetchStats: (userId: string) => Promise<void>
  fetchWeeklyData: (userId: string) => Promise<void>
  setTimeRemaining: (time: number) => void
  reset: () => void
}

export const useFocusStore = create<FocusState>((set) => ({
  isActive: false,
  currentSession: null,
  timeRemaining: 0,
  sessions: [],
  statistics: null,
  weeklyData: [],
  isLoading: false,
  error: null,

  startSession: async (input: FocusSessionInput, userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const session = await focusService.startSession(input, userId)
      set({
        currentSession: session,
        isActive: true,
        timeRemaining: input.duration * 60,
        isLoading: false,
      })
    } catch (error) {
      set({ error: 'Failed to start session', isLoading: false })
    }
  },

  endSession: async (sessionId: string, userId: string, actualDuration: number, completed: boolean, distractions?: number) => {
    set({ error: null })
    try {
      const session = await focusService.endSession(sessionId, userId, actualDuration, completed, distractions)
      set(state => ({
        currentSession: null,
        isActive: false,
        timeRemaining: 0,
        sessions: [session, ...state.sessions],
      }))
    } catch (error) {
      set({ error: 'Failed to end session' })
    }
  },

  fetchHistory: async (userId: string) => {
    try {
      const sessions = await focusService.getSessionHistory(userId)
      set({ sessions })
    } catch (error) {
      set({ error: 'Failed to fetch focus history' })
    }
  },

  fetchStats: async (userId: string) => {
    try {
      const statistics = await focusService.getStatistics(userId)
      set({ statistics })
    } catch (error) {
      set({ error: 'Failed to fetch focus stats' })
    }
  },

  fetchWeeklyData: async (userId: string) => {
    try {
      const weeklyData = await focusService.getWeeklyData(userId)
      set({ weeklyData })
    } catch (error) {
      set({ error: 'Failed to fetch weekly data' })
    }
  },

  setTimeRemaining: (time) => set({ timeRemaining: time }),
  reset: () => set({ isActive: false, currentSession: null, timeRemaining: 0 }),
}))
