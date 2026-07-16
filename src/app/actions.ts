'use server'

import { prisma } from '@/lib/prisma'
import { missionService } from '@/services/missions/mission-service'
import { campaignService } from '@/services/campaigns/campaign-service'
import { notificationService } from '@/services/notifications/notification-service'
import { memoryLaneService } from '@/services/memory-lane/memory-lane-service'
import { analyticsService } from '@/services/analytics/analytics-service'
import { rewardService } from '@/services/rewards/reward-service'
import { xpService } from '@/services/xp/xp-service'
import { XP } from '@/core/constants'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { DEMO_USER_ID, DEMO_COOKIE } from '@/lib/demo'
import * as Sentry from '@sentry/nextjs'
import { cookies, headers } from 'next/headers'
import { rateLimiters, checkRateLimit } from '@/lib/rate-limit'

function logAndReport(context: string, error: unknown): void {
  const message = error instanceof Error ? error.message : 'Unknown error'
  console.error(`[${context}]`, message, error)
  if (error instanceof Error && !(error as any).statusCode) {
    Sentry.captureException(error, { tags: { action: context } })
  }
}

async function getClientIp(): Promise<string> {
  const h = await headers()
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

async function getAuthUserId(): Promise<string> {
  const cookieStore = await cookies()
  const isDemo = cookieStore.get(DEMO_COOKIE)?.value === 'true'
  if (isDemo) return DEMO_USER_ID

  const localUserId = cookieStore.get('local_user_id')?.value
  if (localUserId) return localUserId

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Unauthorized — no session found. Please log in or create an account.')
  }

  const supabase = await createSupabaseServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  return user.id
}

export async function getDashboardData() {
  const userId = await getAuthUserId()
  const [missions, progress, streak, focusStats, campaigns, achievements] = await Promise.all([
    missionService.getTodayMissions(userId),
    prisma.userProgress.findUnique({ where: { userId } }),
    prisma.streak.findUnique({ where: { userId_streakType: { userId, streakType: 'daily' } } }),
    prisma.focusStatistic.findUnique({ where: { userId } }),
    prisma.campaign.count({ where: { userId, status: 'active' } }),
    prisma.userAchievement.count({ where: { userId, NOT: { unlockedAt: null } } }),
  ])

  return { todayMissions: missions, progress, streak, focusStats, activeCampaigns: campaigns, achievementsUnlocked: achievements }
}

export async function ensureUserProfile(userId: string, displayName?: string) {
  const existing = await prisma.profile.findUnique({ where: { userId } })
  if (!existing) {
    await prisma.profile.create({
      data: {
        userId,
        displayName: displayName || 'User',
      },
    })
  }
  const progress = await prisma.userProgress.findUnique({ where: { userId } })
  if (!progress) {
    await prisma.userProgress.create({
      data: { userId, totalXP: 0, currentXP: 0, level: 1, xpToNextLevel: 100 },
    })
  }
  const audioPrefs = await prisma.audioPreference.findUnique({ where: { userId } })
  if (!audioPrefs) {
    await prisma.audioPreference.create({ data: { userId } })
  }
}

export async function startDemo() {
  const existing = await prisma.user.findUnique({ where: { id: DEMO_USER_ID } })
  if (!existing) {
    await prisma.user.create({
      data: {
        id: DEMO_USER_ID,
        email: 'demo@missioncontrol.app',
      },
    })
  }
  await ensureUserProfile(DEMO_USER_ID, 'Demo Explorer')

  const missionCount = await prisma.mission.count({ where: { userId: DEMO_USER_ID } })
  if (missionCount === 0) {
    await prisma.mission.createMany({
      data: [
        { id: 'demo-mission-1', userId: DEMO_USER_ID, title: 'Explore the Dashboard', description: 'Get familiar with your mission overview', difficulty: 'easy', priority: 'high', status: 'completed', xpReward: 25, completedAt: new Date() },
        { id: 'demo-mission-2', userId: DEMO_USER_ID, title: 'Create Your First Campaign', description: 'Start a campaign to group related missions', difficulty: 'medium', priority: 'high', status: 'active', xpReward: 50 },
        { id: 'demo-mission-3', userId: DEMO_USER_ID, title: 'Complete a Focus Session', description: 'Try a 25-minute pomodoro session', difficulty: 'medium', priority: 'medium', status: 'pending', xpReward: 50 },
        { id: 'demo-mission-4', userId: DEMO_USER_ID, title: 'Set Up Your Workspace', description: 'Customize your theme and preferences', difficulty: 'easy', priority: 'low', status: 'pending', xpReward: 25 },
        { id: 'demo-mission-5', userId: DEMO_USER_ID, title: 'Review Your Analytics', description: 'Check your productivity trends', difficulty: 'hard', priority: 'medium', status: 'pending', xpReward: 100 },
      ],
    })

    await prisma.campaign.create({
      data: {
        id: 'demo-campaign-1',
        userId: DEMO_USER_ID,
        title: 'Mission Control Onboarding',
        description: 'Learn the ropes of the platform',
        emoji: '🚀',
        status: 'active',
        missions: { connect: ['demo-mission-1', 'demo-mission-2', 'demo-mission-3', 'demo-mission-4', 'demo-mission-5'].map(id => ({ id })) },
      },
    })

    await prisma.focusSession.create({
      data: {
        id: 'demo-focus-1',
        userId: DEMO_USER_ID,
        type: 'pomodoro',
        duration: 25,
        actualDuration: 22,
        completed: true,
        score: 85,
        startedAt: new Date(Date.now() - 86400000),
      },
    })

    await prisma.focusStatistic.upsert({
      where: { userId: DEMO_USER_ID },
      create: { userId: DEMO_USER_ID, totalSessions: 1, totalMinutes: 22, averageScore: 85, longestSession: 22 },
      update: {},
    })

    const achievements = await prisma.achievement.findMany()
    for (const a of achievements) {
      if (a.key === 'first_mission') {
        await prisma.userAchievement.upsert({
          where: { userId_achievementId: { userId: DEMO_USER_ID, achievementId: a.id } },
          create: { userId: DEMO_USER_ID, achievementId: a.id, unlocked: true, unlockedAt: new Date(), progress: 100 },
          update: {},
        })
      } else {
        await prisma.userAchievement.upsert({
          where: { userId_achievementId: { userId: DEMO_USER_ID, achievementId: a.id } },
          create: { userId: DEMO_USER_ID, achievementId: a.id, progress: 0 },
          update: {},
        })
      }
    }
  }

  const cookieStore = await cookies()
  cookieStore.set(DEMO_COOKIE, 'true', { path: '/', maxAge: 60 * 60 * 24 })
}

export async function endDemo() {
  const cookieStore = await cookies()
  cookieStore.delete(DEMO_COOKIE)
}

export async function registerUser(formData: FormData) {
  try {
    const ip = await getClientIp()
    checkRateLimit(rateLimiters.auth, `register:${ip}`)
    const email = formData.get('email') as string
    const displayName = formData.get('name') as string

    if (!email) return { error: 'Email is required' }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return { error: 'An account with this email already exists' }

    const userId = 'user_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10)

    await prisma.user.create({ data: { id: userId, email } })
    await ensureUserProfile(userId, displayName || email.split('@')[0])

    const cookieStore = await cookies()
    cookieStore.set('local_user_id', userId, { path: '/', maxAge: 60 * 60 * 24 * 30 })
    cookieStore.set('local_user_email', email, { path: '/', maxAge: 60 * 60 * 24 * 30 })

    return { success: true, userId }
  } catch (e: unknown) {
    logAndReport('registerUser', e)
    return { error: 'Failed to create account. Please try again.' }
  }
}

export async function loginWithEmail(formData: FormData) {
  try {
    const ip = await getClientIp()
    checkRateLimit(rateLimiters.auth, `login:${ip}`)
    const email = formData.get('email') as string

    if (!email) return { error: 'Email is required' }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return { error: 'No account found with this email. Try demo mode or create an account.' }

    const cookieStore = await cookies()
    cookieStore.set('local_user_id', user.id, { path: '/', maxAge: 60 * 60 * 24 * 30 })
    cookieStore.set('local_user_email', email, { path: '/', maxAge: 60 * 60 * 24 * 30 })

    return { success: true, userId: user.id }
  } catch (e: unknown) {
    logAndReport('loginWithEmail', e)
    return { error: 'Login failed. Please try again.' }
  }
}

export async function toggleSubtask(subtaskId: string) {
  const userId = await getAuthUserId()
  const subtask = await prisma.subtask.findUnique({ where: { id: subtaskId }, include: { mission: true } })
  if (!subtask || subtask.mission.userId !== userId) throw new Error('Not found')
  return prisma.subtask.update({ where: { id: subtaskId }, data: { completed: !subtask.completed } })
}

export async function createSubtask(missionId: string, title: string) {
  const userId = await getAuthUserId()
  const mission = await prisma.mission.findUnique({ where: { id: missionId } })
  if (!mission || mission.userId !== userId) throw new Error('Not found')
  return prisma.subtask.create({ data: { missionId, title } })
}

export async function getNotifications() {
  const userId = await getAuthUserId()
  return notificationService.getAll(userId, 50)
}

export async function getUnreadCount() {
  const userId = await getAuthUserId()
  return notificationService.getUnreadCount(userId)
}

export async function markNotificationRead(notificationId: string) {
  const userId = await getAuthUserId()
  return notificationService.markAsRead(notificationId, userId)
}

export async function markAllNotificationsRead() {
  const userId = await getAuthUserId()
  return notificationService.markAllAsRead(userId)
}

type ActionResult<T> = { data: T } | { error: string }

// --- Mission Actions ---
export async function fetchMissionsAction(userId: string): Promise<ActionResult<any>> {
  try {
    const authUserId = await getAuthUserId()
    if (authUserId !== userId) return { error: 'Unauthorized' }
    const missions = await missionService.getByUser(userId)
    return { data: missions }
  } catch (e: unknown) {
    logAndReport('fetchMissionsAction', e)
    return { error: 'Failed to fetch missions' }
  }
}

export async function createMissionAction(input: import('@/core/types').MissionCreateInput, userId: string): Promise<ActionResult<any>> {
  try {
    checkRateLimit(rateLimiters.mutations, `mission:create:${userId}`)
    const authUserId = await getAuthUserId()
    if (authUserId !== userId) return { error: 'Unauthorized' }
    const mission = await missionService.create(input, userId)
    return { data: mission }
  } catch (e: unknown) {
    logAndReport('createMissionAction', e)
    return { error: 'Failed to create mission' }
  }
}

export async function updateMissionAction(id: string, input: import('@/core/types').MissionUpdateInput, userId: string): Promise<ActionResult<any>> {
  try {
    checkRateLimit(rateLimiters.mutations, `mission:update:${userId}`)
    const authUserId = await getAuthUserId()
    if (authUserId !== userId) return { error: 'Unauthorized' }
    const mission = await missionService.update(id, input, userId)
    return { data: mission }
  } catch (e: unknown) {
    logAndReport('updateMissionAction', e)
    return { error: 'Failed to update mission' }
  }
}

export async function reopenMissionAction(id: string, userId: string): Promise<ActionResult<any>> {
  try {
    const authUserId = await getAuthUserId()
    if (authUserId !== userId) return { error: 'Unauthorized' }
    const mission = await missionService.reopen(id, userId)
    return { data: mission }
  } catch (e: unknown) {
    logAndReport('reopenMissionAction', e)
    return { error: 'Failed to reopen mission' }
  }
}

export async function completeMissionAction(id: string, userId: string): Promise<ActionResult<any>> {
  try {
    checkRateLimit(rateLimiters.mutations, `mission:complete:${userId}`)
    const authUserId = await getAuthUserId()
    if (authUserId !== userId) return { error: 'Unauthorized' }
    const mission = await missionService.complete(id, userId)
    let rewardEvents = null
    if (mission) {
      try {
        const result = await rewardService.processMissionCompletion(userId, id, mission.difficulty as any)
        rewardEvents = result.rewardEvents
      } catch (e) {
        console.error('[completeMissionAction] reward processing failed (non-fatal):', e)
      }
    }
    return { data: { mission, rewardEvents } }
  } catch (e: unknown) {
    logAndReport('completeMissionAction', e)
    return { error: 'Failed to complete mission' }
  }
}

export async function deleteMissionAction(id: string, userId: string): Promise<ActionResult<any>> {
  try {
    checkRateLimit(rateLimiters.mutations, `mission:delete:${userId}`)
    const authUserId = await getAuthUserId()
    if (authUserId !== userId) return { error: 'Unauthorized' }
    await missionService.delete(id, userId)
    return { data: null }
  } catch (e: unknown) {
    logAndReport('deleteMissionAction', e)
    return { error: 'Failed to delete mission' }
  }
}

// --- Campaign Actions ---
export async function fetchCampaignsAction(userId: string) {
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  return campaignService.getByUser(userId)
}

export async function createCampaignAction(input: import('@/core/types').CampaignCreateInput, userId: string) {
  checkRateLimit(rateLimiters.mutations, `campaign:create:${userId}`)
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  return campaignService.create(input, userId)
}

export async function updateCampaignAction(id: string, input: import('@/core/types').CampaignUpdateInput, userId: string) {
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  return campaignService.update(id, input, userId)
}

export async function deleteCampaignAction(id: string, userId: string) {
  checkRateLimit(rateLimiters.mutations, `campaign:delete:${userId}`)
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  return campaignService.delete(id, userId)
}

// --- Analytics Actions ---
export async function getDashboardStatsAction(userId: string) {
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  return analyticsService.getDashboardStats(userId)
}

export async function getMissionCompletionRateAction(userId: string) {
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  return analyticsService.getMissionCompletionRate(userId)
}

export async function getFocusTimeAction(userId: string) {
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  return analyticsService.getFocusTime(userId)
}

export async function getCategoryDistributionAction(userId: string) {
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  return analyticsService.getCategoryDistribution(userId)
}

// --- XP Actions ---
export async function getLevelInfoAction(userId: string) {
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  return xpService.getLevelInfo(userId)
}

export async function getXPHistoryAction(userId: string) {
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  return xpService.getXPHistory(userId, 20)
}

// --- Focus Actions ---
export async function startFocusSessionAction(input: import('@/core/types').FocusSessionInput, userId: string) {
  checkRateLimit(rateLimiters.mutations, `focus:start:${userId}`)
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  const { focusService } = await import('@/services/focus/focus-service')
  return focusService.startSession(input, userId)
}

export async function endFocusSessionAction(sessionId: string, userId: string, data: { actualDuration: number; completed: boolean; distractions: number }) {
  checkRateLimit(rateLimiters.mutations, `focus:end:${userId}`)
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  const { focusService } = await import('@/services/focus/focus-service')
  const session = await focusService.endSession(sessionId, userId, data.actualDuration, data.completed, data.distractions)
  if (data.completed && data.actualDuration >= 5) {
    try {
      const focusXP = Math.round(data.actualDuration * 0.5)
      const total = focusXP + Math.round(focusXP * XP.FOCUS_BONUS)
      await xpService.awardXP(userId, total, 'focus_bonus', sessionId)

      notificationService.create(userId, 'focus', 'Focus Session Complete', `Completed ${data.actualDuration} min session with ${data.distractions} distractions`)
      memoryLaneService.addEntry(userId, 'major_win', `Focus Session: ${data.actualDuration} minutes`, `Completed a ${data.actualDuration}-minute focus session`, { sessionId, score: (session as any)?.score }, 5)
    } catch (e) {
      console.error('[endFocusSessionAction] XP award failed (non-fatal):', e)
    }
  }
  return session
}

export async function getFocusSessionHistoryAction(userId: string) {
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  const { focusService } = await import('@/services/focus/focus-service')
  return focusService.getSessionHistory(userId)
}

export async function getFocusStatisticsAction(userId: string) {
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  const { focusService } = await import('@/services/focus/focus-service')
  return focusService.getStatistics(userId)
}

export async function getFocusWeeklyDataAction(userId: string) {
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  const { focusService } = await import('@/services/focus/focus-service')
  return focusService.getWeeklyData(userId)
}

// --- Achievement Actions ---
export async function getUserAchievementsAction(userId: string) {
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  const { achievementService } = await import('@/services/achievements/achievement-service')
  return achievementService.getUserAchievements(userId)
}

// --- Memory Lane Actions ---
export async function getMemoryLaneEntriesAction(userId: string) {
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  const { memoryLaneService } = await import('@/services/memory-lane/memory-lane-service')
  return memoryLaneService.getEntries(userId)
}

export async function getMemoryLaneTimelineAction(userId: string) {
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  const { memoryLaneService } = await import('@/services/memory-lane/memory-lane-service')
  return memoryLaneService.getTimeline(userId)
}

// --- AI Actions ---
export async function generateDailyBriefingAction(userId: string) {
  checkRateLimit(rateLimiters.ai, `ai:briefing:${userId}`)
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  const { aiService } = await import('@/services/ai/ai-service')
  return aiService.generateDailyBriefing(userId)
}

export async function generateWeeklyPlanAction(userId: string) {
  checkRateLimit(rateLimiters.ai, `ai:weeklyplan:${userId}`)
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  const { aiService } = await import('@/services/ai/ai-service')
  return aiService.generateWeeklyPlan(userId)
}

export async function breakDownGoalAction(goal: string, userId: string) {
  checkRateLimit(rateLimiters.ai, `ai:goalbreakdown:${userId}`)
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  const { aiService } = await import('@/services/ai/ai-service')
  return aiService.breakDownGoal(goal, userId)
}

export async function getCoachingAction(question: string, userId: string) {
  checkRateLimit(rateLimiters.ai, `ai:coaching:${userId}`)
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  const { aiService } = await import('@/services/ai/ai-service')
  return aiService.getCoaching(userId, question)
}

export async function getMotivationAction(userId: string) {
  checkRateLimit(rateLimiters.ai, `ai:motivation:${userId}`)
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  const { aiService } = await import('@/services/ai/ai-service')
  return aiService.getMotivation(userId)
}

export async function getProviderHealthAction() {
  await getAuthUserId()
  const { aiService } = await import('@/services/ai/ai-service')
  return aiService.getProviderHealth()
}

// --- Workspace Actions ---
export async function getWorkspaceProgressionAction(userId: string) {
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  const { workspaceService } = await import('@/services/workspace/workspace-service')
  return workspaceService.getByUserId(userId)
}
