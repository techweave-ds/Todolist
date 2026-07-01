import { create } from 'zustand'
import {
  generateDailyBriefingAction,
  generateWeeklyPlanAction,
  breakDownGoalAction,
  getCoachingAction,
  getMotivationAction,
  getProviderHealthAction,
} from '@/app/actions'

interface CoachMessage {
  role: 'user' | 'coach'
  content: string
}

interface AiBreakdownResult {
  missions: { title: string; description?: string; difficulty?: string }[]
  campaign?: { title: string; description?: string }
}

interface AiState {
  briefing: string | null
  briefingLoading: boolean
  weeklyPlan: any
  weeklyPlanLoading: boolean
  breakdown: AiBreakdownResult | null
  goalResult: any
  goalLoading: boolean
  coaching: string | null
  coachMessages: CoachMessage[]
  coachLoading: boolean
  motivation: string | null
  providerHealth: Record<string, boolean> | null
  isLoading: boolean
  error: string | null
  fetchBriefing: (userId: string) => Promise<void>
  fetchWeeklyPlan: (userId: string) => Promise<void>
  generateWeeklyPlan: (userId: string) => Promise<void>
  breakDownGoal: (goal: string, userId: string) => Promise<void>
  getCoaching: (userId: string, question: string) => Promise<void>
  askCoach: (userId: string, question?: string) => Promise<void>
  getMotivation: (userId: string) => Promise<void>
  getProviderHealth: () => Promise<void>
  clearCoach: () => void
}

export const useAIStore = create<AiState>((set, get) => ({
  briefing: null,
  briefingLoading: false,
  weeklyPlan: null,
  weeklyPlanLoading: false,
  breakdown: null,
  goalResult: null,
  goalLoading: false,
  coaching: null,
  coachMessages: [],
  coachLoading: false,
  motivation: null,
  providerHealth: null,
  isLoading: false,
  error: null,

  fetchBriefing: async (userId: string) => {
    set({ briefingLoading: true, error: null })
    try {
      const result = await generateDailyBriefingAction(userId) as any
      set({ briefing: result?.content || null, briefingLoading: false })
    } catch {
      set({ error: 'Failed to generate briefing', briefingLoading: false })
    }
  },

  fetchWeeklyPlan: async (userId: string) => {
    set({ weeklyPlanLoading: true, error: null })
    try {
      const result = await generateWeeklyPlanAction(userId) as any
      set({ weeklyPlan: result?.content || null, weeklyPlanLoading: false })
    } catch {
      set({ error: 'Failed to generate weekly plan', weeklyPlanLoading: false })
    }
  },

  generateWeeklyPlan: async (userId: string) => {
    set({ weeklyPlanLoading: true, error: null })
    try {
      const result = await generateWeeklyPlanAction(userId) as any
      set({ weeklyPlan: result?.content || null, weeklyPlanLoading: false })
    } catch {
      set({ error: 'Failed to generate weekly plan', weeklyPlanLoading: false })
    }
  },

  breakDownGoal: async (goal: string, userId: string) => {
    set({ goalLoading: true, error: null })
    try {
      const result = await breakDownGoalAction(goal, userId) as any
      set({ breakdown: result, goalResult: result, goalLoading: false })
    } catch {
      set({ error: 'Failed to break down goal', goalLoading: false })
    }
  },

  getCoaching: async (userId: string, question: string) => {
    set({ coachLoading: true, error: null })
    try {
      const messages = get().coachMessages
      const result = await getCoachingAction(question, userId) as any
      set({
        coaching: result,
        coachMessages: [...messages, { role: 'coach', content: result }],
        coachLoading: false,
      })
    } catch {
      set({ error: 'Failed to get coaching', coachLoading: false })
    }
  },

  askCoach: async (userId: string, question?: string) => {
    set({ coachLoading: true, error: null })
    try {
      const messages = get().coachMessages
      if (!question) {
        const result = await getCoachingAction('Hello, I need help with productivity', userId) as any
        set({
          coaching: result,
          coachMessages: [{ role: 'coach', content: result }],
          coachLoading: false,
        })
      } else {
        const result = await getCoachingAction(question, userId) as any
        set({
          coaching: result,
          coachMessages: [...messages, { role: 'user', content: question }, { role: 'coach', content: result }],
          coachLoading: false,
        })
      }
    } catch {
      set({ error: 'Failed to get coaching', coachLoading: false })
    }
  },

  getMotivation: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const result = await getMotivationAction(userId) as any
      set({ motivation: result, isLoading: false })
    } catch {
      set({ error: 'Failed to get motivation', isLoading: false })
    }
  },

  getProviderHealth: async () => {
    try {
      const health = await getProviderHealthAction() as any
      set({ providerHealth: health })
    } catch {
      set({ error: 'Failed to check AI provider health' })
    }
  },

  clearCoach: () => set({ coachMessages: [], coaching: null }),
}))
