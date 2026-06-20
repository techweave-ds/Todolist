import { prisma } from '@/lib/prisma'
import { eventBus } from '@/core/events'
import { CampaignCreateInput, CampaignUpdateInput } from '@/core/types'
import { generateId } from '@/lib/utils'
import { handleServiceError } from '@/lib/service-error'

export class CampaignService {
  async create(input: CampaignCreateInput, userId: string) {
    try {
      const campaign = await prisma.campaign.create({
        data: {
          id: generateId(),
          userId,
          title: input.title,
          description: input.description,
          emoji: input.emoji || '🎯',
          color: input.color || '#8B5CF6',
          deadline: input.deadline ? new Date(input.deadline) : null,
        },
      })

      await eventBus.emit({
        type: 'CAMPAIGN_CREATED',
        payload: { campaignId: campaign.id, userId, data: campaign },
      })

      return campaign
    } catch (error) {
      handleServiceError(error, 'campaignService.create')
    }
  }

  async update(id: string, input: CampaignUpdateInput, userId: string) {
    try {
      const campaign = await prisma.campaign.update({
        where: { id, userId },
        data: {
          ...(input.title !== undefined && { title: input.title }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.emoji !== undefined && { emoji: input.emoji }),
          ...(input.color !== undefined && { color: input.color }),
          ...(input.status !== undefined && { status: input.status }),
          ...(input.deadline !== undefined && { deadline: input.deadline ? new Date(input.deadline) : null }),
        },
        include: { missions: true },
      })

      if (input.status === 'completed') {
        await eventBus.emit({
          type: 'CAMPAIGN_COMPLETED',
          payload: { campaignId: id, userId, data: campaign },
        })
      } else {
        await eventBus.emit({
          type: 'CAMPAIGN_UPDATED',
          payload: { campaignId: id, userId, data: campaign },
        })
      }

      return campaign
    } catch (error) {
      handleServiceError(error, 'campaignService.update')
    }
  }

  async delete(id: string, userId: string) {
    try {
      await prisma.campaign.delete({ where: { id, userId } })
    } catch (error) {
      handleServiceError(error, 'campaignService.delete')
    }
  }

  async getById(id: string, userId: string) {
    try {
      return await prisma.campaign.findFirst({
        where: { id, userId },
        include: {
          missions: {
            include: { subtasks: true },
            orderBy: [{ priority: 'desc' }, { deadline: 'asc' }],
          },
        },
      })
    } catch (error) {
      handleServiceError(error, 'campaignService.getById')
    }
  }

  async getByUser(userId: string) {
    try {
      const campaigns = await prisma.campaign.findMany({
        where: { userId },
        include: {
          missions: {
            select: { id: true, status: true, progress: true, xpReward: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
      })

      return campaigns.map(c => ({
        ...c,
        progress: c.missions.length > 0
          ? Math.round((c.missions.filter(m => m.status === 'completed').length / c.missions.length) * 100)
          : 0,
        totalMissions: c.missions.length,
        completedMissions: c.missions.filter(m => m.status === 'completed').length,
        totalXP: c.missions.reduce((sum, m) => sum + (m.status === 'completed' ? m.xpReward : 0), 0),
      }))
    } catch (error) {
      handleServiceError(error, 'campaignService.getByUser')
    }
  }

  async completeCampaign(id: string, userId: string) {
    return this.update(id, { status: 'completed' }, userId)
  }
}

export const campaignService = new CampaignService()
