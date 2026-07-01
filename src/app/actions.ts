'use server'

import { prisma } from '@/lib/prisma'
import { missionService } from '@/services/missions/mission-service'
import { campaignService } from '@/services/campaigns/campaign-service'
import { notificationService } from '@/services/notifications/notification-service'
import { analyticsService } from '@/services/analytics/analytics-service'
import { xpService } from '@/services/xp/xp-service'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { DEMO_USER_ID, DEMO_COOKIE } from '@/lib/demo'
import { cookies } from 'next/headers'

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

export async function createMission(formData: FormData) {
  const userId = await getAuthUserId()
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const difficulty = formData.get('difficulty') as string
  const priority = formData.get('priority') as string
  const deadline = formData.get('deadline') as string
  const estimatedTime = formData.get('estimatedTime') as string

  return missionService.create({
    title,
    description: description || undefined,
    difficulty: (difficulty ?? 'medium') as any,
    priority: (priority ?? 'medium') as any,
    deadline: deadline || undefined,
    estimatedTime: estimatedTime ? parseInt(estimatedTime) : undefined,
  }, userId)
}

export async function completeMission(missionId: string) {
  const userId = await getAuthUserId()
  return missionService.complete(missionId, userId)
}

export async function deleteMission(missionId: string) {
  const userId = await getAuthUserId()
  return missionService.delete(missionId, userId)
}

export async function createCampaign(formData: FormData) {
  const userId = await getAuthUserId()
  const title = formData.get('title') as string
  return campaignService.create({ title }, userId)
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

function generateId() {
  return 'user_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
}

export async function registerUser(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const displayName = formData.get('name') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters' }
  }

  const cookieStore = await cookies()

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { error: 'An account with this email already exists' }
  }

  const userId = generateId()

  await prisma.user.create({
    data: { id: userId, email },
  })

  await ensureUserProfile(userId, displayName || email.split('@')[0])

  cookieStore.set('local_user_id', userId, { path: '/', maxAge: 60 * 60 * 24 * 30 })
  cookieStore.set('local_user_email', email, { path: '/', maxAge: 60 * 60 * 24 * 30 })

  return { success: true, userId }
}

export async function loginWithEmail(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email) return { error: 'Email is required' }

  const cookieStore = await cookies()
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    return { error: 'No account found with this email. Try demo mode or create an account.' }
  }

  cookieStore.set('local_user_id', user.id, { path: '/', maxAge: 60 * 60 * 24 * 30 })
  cookieStore.set('local_user_email', email, { path: '/', maxAge: 60 * 60 * 24 * 30 })

  return { success: true, userId: user.id }
}

export async function toggleSubtask(subtaskId: string, completed: boolean) {
  const userId = await getAuthUserId()
  const subtask = await prisma.subtask.findUnique({ where: { id: subtaskId }, include: { mission: true } })
  if (!subtask || subtask.mission.userId !== userId) throw new Error('Not found')
  return prisma.subtask.update({ where: { id: subtaskId }, data: { completed: !completed } })
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
    const message = e instanceof Error ? e.message : 'Unknown error'
    console.error('[fetchMissionsAction]', message)
    return { error: message }
  }
}

export async function createMissionAction(input: import('@/core/types').MissionCreateInput, userId: string): Promise<ActionResult<any>> {
  try {
    const authUserId = await getAuthUserId()
    if (authUserId !== userId) return { error: 'Unauthorized' }
    const mission = await missionService.create(input, userId)
    return { data: mission }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    console.error('[createMissionAction]', message)
    return { error: message }
  }
}

export async function updateMissionAction(id: string, input: import('@/core/types').MissionUpdateInput, userId: string): Promise<ActionResult<any>> {
  try {
    const authUserId = await getAuthUserId()
    if (authUserId !== userId) return { error: 'Unauthorized' }
    const mission = await missionService.update(id, input, userId)
    return { data: mission }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    console.error('[updateMissionAction]', message)
    return { error: message }
  }
}

export async function completeMissionAction(id: string, userId: string): Promise<ActionResult<any>> {
  try {
    const authUserId = await getAuthUserId()
    if (authUserId !== userId) return { error: 'Unauthorized' }
    const mission = await missionService.complete(id, userId)
    return { data: mission }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    console.error('[completeMissionAction]', message)
    return { error: message }
  }
}

export async function deleteMissionAction(id: string, userId: string): Promise<ActionResult<any>> {
  try {
    const authUserId = await getAuthUserId()
    if (authUserId !== userId) return { error: 'Unauthorized' }
    await missionService.delete(id, userId)
    return { data: null }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    console.error('[deleteMissionAction]', message)
    return { error: message }
  }
}

// --- Campaign Actions ---
export async function fetchCampaignsAction(userId: string) {
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  return campaignService.getByUser(userId)
}

export async function createCampaignAction(input: import('@/core/types').CampaignCreateInput, userId: string) {
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
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  const { focusService } = await import('@/services/focus/focus-service')
  return focusService.startSession(input, userId)
}

export async function endFocusSessionAction(sessionId: string, userId: string, data: { actualDuration: number; completed: boolean; distractions: number }) {
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  const { focusService } = await import('@/services/focus/focus-service')
  return focusService.endSession(sessionId, userId, data.actualDuration, data.completed, data.distractions)
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
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  const { aiService } = await import('@/services/ai/ai-service')
  return aiService.generateDailyBriefing(userId)
}

export async function generateWeeklyPlanAction(userId: string) {
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  const { aiService } = await import('@/services/ai/ai-service')
  return aiService.generateWeeklyPlan(userId)
}

export async function breakDownGoalAction(goal: string, userId: string) {
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  const { aiService } = await import('@/services/ai/ai-service')
  return aiService.breakDownGoal(goal, userId)
}

export async function getCoachingAction(question: string, userId: string) {
  const authUserId = await getAuthUserId()
  if (authUserId !== userId) throw new Error('Unauthorized')
  const { aiService } = await import('@/services/ai/ai-service')
  return aiService.getCoaching(userId, question)
}

export async function getMotivationAction(userId: string) {
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
