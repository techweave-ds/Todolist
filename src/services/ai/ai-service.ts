import { prisma } from '@/lib/prisma'
import { aiEngine } from '@/ai/ai-engine'
import type { AiBreakdownResult, AiPlanResult } from '@/core/types/ai'
import { handleServiceError } from '@/lib/service-error'

export class AIService {
  async breakDownGoal(goal: string, userId: string): Promise<AiBreakdownResult> {
    return aiEngine.breakDownGoal(goal, userId)
  }

  async generateMissions(context: string, userId: string) {
    return aiEngine.generateMissionsFromContext(context, userId)
  }

  async generateWeeklyPlan(userId: string): Promise<AiPlanResult> {
    return aiEngine.generateWeeklyPlan(userId)
  }

  async generateDailyBriefing(userId: string): Promise<string> {
    return aiEngine.generateDailyBriefing(userId)
  }

  async getCoaching(userId: string, question?: string): Promise<string> {
    return aiEngine.getProductivityCoaching(userId, question)
  }

  async getMotivation(userId: string, context?: string): Promise<string> {
    return aiEngine.getMotivation(userId, context)
  }

  async getGenerationHistory(userId: string, limit: number = 20) {
    try {
      return prisma.aIGeneration.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      })
    } catch (error) {
      handleServiceError(error, 'aiService.getGenerationHistory')
    }
  }

  async getProviderHealth() {
    return aiEngine.checkProviderHealth()
  }
}

export const aiService = new AIService()
