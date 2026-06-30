import { create } from 'zustand'
import { AiPlanResult, AiBreakdownResult } from '@/core/types/ai'
import { aiService } from '@/services/ai/ai-service'

interface CoachMessage {
  role: 'user' | 'coach'
  content: string
}

interface AIState {
  briefing: string | null
  briefingLoading: boolean
  weeklyPlan: AiPlanResult | null
  weeklyPlanLoading: boolean
  goalResult: AiBreakdownResult | null
  goalLoading: boolean
  coachMessages: CoachMessage[]
  coachLoading: boolean
  motivation: string | null
  providerHealth: Record<string, boolean> | null
  fetchBriefing: (userId: string) => Promise<void>
  generateWeeklyPlan: (userId: string) => Promise<void>
  breakDownGoal: (goal: string, userId: string) => Promise<AiBreakdownResult | null>
  askCoach: (userId: string, question?: string) => Promise<void>
  getMotivation: (userId: string, context?: string) => Promise<void>
  checkProviders: () => Promise<void>
  clearCoach: () => void
}

export const useAIStore = create<AIState>((set, get) => ({
  briefing: null,
  briefingLoading: false,
  weeklyPlan: null,
  weeklyPlanLoading: false,
  goalResult: null,
  goalLoading: false,
  coachMessages: [],
  coachLoading: false,
  motivation: null,
  providerHealth: null,

  fetchBriefing: async (userId) => {
    set({ briefingLoading: true })
    try {
      const briefing = await aiService.generateDailyBriefing(userId)
      set({ briefing, briefingLoading: false })
    } catch {
      set({ briefing: 'Good morning! Ready to tackle today?', briefingLoading: false })
    }
  },

  generateWeeklyPlan: async (userId) => {
    set({ weeklyPlanLoading: true })
    try {
      const plan = await aiService.generateWeeklyPlan(userId)
      set({ weeklyPlan: plan, weeklyPlanLoading: false })
    } catch {
      set({ weeklyPlanLoading: false })
    }
  },

  breakDownGoal: async (goal, userId) => {
    set({ goalLoading: true })
    try {
      const result = await aiService.breakDownGoal(goal, userId)
      set({ goalResult: result, goalLoading: false })
      return result
    } catch {
      set({ goalLoading: false })
      return null
    }
  },

  askCoach: async (userId, question) => {
    const userMsg = question ? { role: 'user' as const, content: question } : null
    if (userMsg) {
      set((s) => ({ coachMessages: [...s.coachMessages, userMsg], coachLoading: true }))
    } else {
      set({ coachLoading: true })
    }

    try {
      const response = await aiService.getCoaching(userId, question)
      const coachResponse = response || 'Commander. Ready for your briefing. What objective are we tackling?'
      set((s) => ({
        coachMessages: [...s.coachMessages, { role: 'coach', content: coachResponse }],
        coachLoading: false,
      }))
    } catch {
      set((s) => ({
        coachMessages: [...s.coachMessages, { role: 'coach', content: 'Commander. Ready for your briefing. What objective are we tackling?' }],
        coachLoading: false,
      }))
    }
  },

  getMotivation: async (userId, context) => {
    try {
      const motivation = await aiService.getMotivation(userId, context)
      set({ motivation })
    } catch {
      set({ motivation: 'Keep going — you are making progress!' })
    }
  },

  checkProviders: async () => {
    try {
      const health = await aiService.getProviderHealth()
      set({ providerHealth: health })
    } catch { /* ignore */ }
  },

  clearCoach: () => set({ coachMessages: [], goalResult: null, weeklyPlan: null }),
}))
