import { create } from 'zustand'
import { FocusSessionInput } from '@/core/types'
import {
  startFocusSessionAction,
  endFocusSessionAction,
  getFocusSessionHistoryAction,
  getFocusStatisticsAction,
  getFocusWeeklyDataAction,
} from '@/app/actions'

interface FocusSession {
  id: string
  type: string
  duration: number
  actualDuration: number | null
  completed: boolean
  score: number | null
  environment: string | null
  startedAt: string | Date
  endedAt: string | Date | null
}

interface FocusStatistics {
  totalSessions: number
  totalMinutes: number
  averageScore: number
  longestSession: number
  currentStreak: number
  bestStreak: number
  weeklyMinutes: number
}

interface FocusWeeklyEntry {
  date: string
  minutes: number
  sessions: number
}

interface FocusState {
  currentSession: FocusSession | null
  sessions: FocusSession[]
  sessionHistory: FocusSession[]
  statistics: FocusStatistics | null
  weeklyData: FocusWeeklyEntry[]
  isActive: boolean
  timeRemaining: number
  isLoading: boolean
  error: string | null
  startSession: (input: FocusSessionInput, userId: string) => Promise<void>
  endSession: (sessionId: string, userId: string, actualDuration: number, completed: boolean, distractions: number) => Promise<void>
  fetchHistory: (userId: string) => Promise<void>
  fetchSessionHistory: (userId: string) => Promise<void>
  fetchStats: (userId: string) => Promise<void>
  fetchWeeklyData: (userId: string) => Promise<void>
  setTimeRemaining: (t: number) => void
}

export const useFocusStore = create<FocusState>((set) => ({
  currentSession: null,
  sessions: [],
  sessionHistory: [],
  statistics: null,
  weeklyData: [],
  isActive: false,
  timeRemaining: 0,
  isLoading: false,
  error: null,

  startSession: async (input: FocusSessionInput, userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const session = await startFocusSessionAction(input, userId) as FocusSession
      set({ currentSession: session, isActive: true, isLoading: false })
    } catch {
      set({ error: 'Failed to start session', isLoading: false })
    }
  },

  endSession: async (sessionId: string, userId: string, actualDuration: number, completed: boolean, distractions: number) => {
    set({ isLoading: true })
    try {
      const session = await endFocusSessionAction(sessionId, userId, { actualDuration, completed, distractions }) as FocusSession
      set({ currentSession: session, isActive: false, timeRemaining: 0, isLoading: false })
    } catch {
      set({ error: 'Failed to end session', isLoading: false })
    }
  },

  fetchHistory: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const history = await getFocusSessionHistoryAction(userId) as FocusSession[]
      set({ sessions: history, sessionHistory: history, isLoading: false })
    } catch {
      set({ error: 'Failed to fetch session history', isLoading: false })
    }
  },

  fetchSessionHistory: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const history = await getFocusSessionHistoryAction(userId) as FocusSession[]
      set({ sessionHistory: history, isLoading: false })
    } catch {
      set({ error: 'Failed to fetch session history', isLoading: false })
    }
  },

  fetchStats: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const stats = await getFocusStatisticsAction(userId) as FocusStatistics
      set({ statistics: stats, isLoading: false })
    } catch {
      set({ error: 'Failed to fetch statistics', isLoading: false })
    }
  },

  fetchWeeklyData: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const data = await getFocusWeeklyDataAction(userId) as FocusWeeklyEntry[]
      set({ weeklyData: data, isLoading: false })
    } catch {
      set({ error: 'Failed to fetch weekly data', isLoading: false })
    }
  },

  setTimeRemaining: (t) => set({ timeRemaining: t }),
}))
