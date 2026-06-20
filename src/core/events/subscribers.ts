import { eventBus } from './event-bus'
import { rewardService } from '@/services/rewards/reward-service'
import { notificationService } from '@/services/notifications/notification-service'
import { memoryLaneService } from '@/services/memory-lane/memory-lane-service'
import { campaignService } from '@/services/campaigns/campaign-service'
import { setupAudioEventSubscriptions } from '@/audio/engine/audio-engine'
import { xpService } from '@/services/xp/xp-service'
import { XP } from '@/core/constants'
import type { AppEvent } from '@/core/types'

async function autoCompleteCampaign(userId: string, campaignId: string): Promise<void> {
  try {
    const campaign = await campaignService.getById(campaignId, userId)
    if (!campaign || campaign.status === 'completed') return
    const allDone = campaign.missions.every(m => m.status === 'completed')
    if (allDone) {
      await campaignService.completeCampaign(campaignId, userId)
    }
  } catch {
    // best-effort
  }
}

export function registerAllSubscribers(): void {
  setupAudioEventSubscriptions()

  eventBus.subscribe('MISSION_COMPLETED', async (event: AppEvent) => {
    const payload = event.payload as { missionId: string; userId: string; data?: { campaignId?: string; difficulty: string } }
    const difficulty = (payload.data?.difficulty as any) || 'medium'
    await rewardService.processMissionCompletion(payload.userId, payload.missionId, difficulty)

    if (payload.data?.campaignId) {
      await autoCompleteCampaign(payload.userId, payload.data.campaignId)
    }
  })

  eventBus.subscribe('FOCUS_ENDED', async (event: AppEvent) => {
    const payload = event.payload as { userId: string; sessionId: string; duration: number; completed: boolean }
    if (payload.completed && payload.duration >= 5) {
      const focusXP = Math.round(payload.duration * 0.5)
      await xpService.awardXP(payload.userId, focusXP + XP.FOCUS_BONUS, 'focus_bonus', payload.sessionId)
    }
  })

  eventBus.subscribe('LEVEL_UP', async (event: AppEvent) => {
    const payload = event.payload as { userId: string; level: number; data?: unknown }
    const { userId, level } = payload
    await notificationService.create(userId, 'system', `Level ${level} Reached!`, `You advanced to level ${level}`)
    await memoryLaneService.addEntry(userId, 'milestone', `Level ${level} Reached!`, `Advanced to level ${level}`, { level }, 8)
  })

  eventBus.subscribe('ACHIEVEMENT_UNLOCKED', async (event: AppEvent) => {
    const payload = event.payload as { userId: string; achievementKey: string; achievementTitle: string; data?: unknown }
    const { userId, achievementKey, achievementTitle } = payload
    await notificationService.create(userId, 'achievement', 'Achievement Unlocked!', `Unlocked: ${achievementTitle}`, { key: achievementKey })
    await memoryLaneService.addEntry(userId, 'achievement', `Achievement: ${achievementTitle}`, 'Unlocked a new achievement', { key: achievementKey }, 8)
  })
}
