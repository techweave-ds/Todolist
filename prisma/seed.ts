import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001'

async function main() {
  console.log('Seeding demo data...')

  const existing = await prisma.user.findUnique({ where: { id: DEMO_USER_ID } })
  if (existing) {
    console.log('Demo user already exists, skipping.')
    return
  }

  await prisma.user.create({
    data: {
      id: DEMO_USER_ID,
      email: 'demo@missioncontrol.app',
    },
  })

  await prisma.profile.create({
    data: {
      userId: DEMO_USER_ID,
      displayName: 'Demo Explorer',
    },
  })

  await prisma.userProgress.create({
    data: { userId: DEMO_USER_ID, totalXP: 275, currentXP: 175, level: 2, xpToNextLevel: 100, totalMissionsCompleted: 3 },
  })

  await prisma.audioPreference.create({ data: { userId: DEMO_USER_ID } })

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
      missions: { connect: [{ id: 'demo-mission-1' }, { id: 'demo-mission-2' }, { id: 'demo-mission-3' }, { id: 'demo-mission-4' }, { id: 'demo-mission-5' }] },
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
      endedAt: new Date(Date.now() - 86400000 + 22 * 60000),
    },
  })

  await prisma.focusStatistic.create({
    data: { userId: DEMO_USER_ID, totalSessions: 1, totalMinutes: 22, averageScore: 85, longestSession: 22, currentStreak: 1, bestStreak: 1, weeklyMinutes: 22, monthlyMinutes: 22 },
  })

  await prisma.streak.create({
    data: { userId: DEMO_USER_ID, currentStreak: 3, longestStreak: 5, lastActivityDate: new Date(), streakType: 'daily' },
  })

  const achievementDefs = await prisma.achievement.findMany()
  if (achievementDefs.length === 0) {
    const achievements = [
      { key: 'first_mission', title: 'First Mission', description: 'Complete your first mission', emoji: '🎯', rarity: 'common', xpReward: 50 },
      { key: 'streak_7', title: 'Week Warrior', description: 'Maintain a 7-day streak', emoji: '🔥', rarity: 'rare', xpReward: 200 },
      { key: 'streak_30', title: 'Monthly Master', description: 'Maintain a 30-day streak', emoji: '💪', rarity: 'epic', xpReward: 500 },
      { key: 'missions_10', title: 'Getting Started', description: 'Complete 10 missions', emoji: '📋', rarity: 'common', xpReward: 100 },
      { key: 'missions_50', title: 'Mission Machine', description: 'Complete 50 missions', emoji: '⚡', rarity: 'rare', xpReward: 300 },
      { key: 'missions_100', title: 'Century Club', description: 'Complete 100 missions', emoji: '🏆', rarity: 'epic', xpReward: 600 },
      { key: 'campaign_finisher', title: 'Campaign Finisher', description: 'Complete your first campaign', emoji: '🎉', rarity: 'rare', xpReward: 250 },
      { key: 'focus_master', title: 'Focus Master', description: 'Complete 10 focus sessions', emoji: '🧘', rarity: 'common', xpReward: 100 },
      { key: 'focus_100', title: 'Deep Focus', description: 'Complete 100 focus sessions', emoji: '🧠', rarity: 'epic', xpReward: 500 },
      { key: 'early_bird', title: 'Early Bird', description: 'Complete a mission before 8 AM', emoji: '🌅', rarity: 'rare', xpReward: 150 },
      { key: 'night_owl', title: 'Night Owl', description: 'Complete a mission after 10 PM', emoji: '🦉', rarity: 'rare', xpReward: 150 },
      { key: 'level_5', title: 'Rising Star', description: 'Reach level 5', emoji: '⭐', rarity: 'common', xpReward: 100 },
      { key: 'level_10', title: 'Power User', description: 'Reach level 10', emoji: '🌟', rarity: 'rare', xpReward: 300 },
      { key: 'level_25', title: 'Legend in the Making', description: 'Reach level 25', emoji: '💫', rarity: 'epic', xpReward: 800 },
    ]
    for (const a of achievements) {
      await prisma.achievement.upsert({
        where: { key: a.key },
        create: a,
        update: {},
      })
    }
  }

  const achievement = await prisma.achievement.findUnique({ where: { key: 'first_mission' } })
  if (achievement) {
    await prisma.userAchievement.create({
      data: { userId: DEMO_USER_ID, achievementId: achievement.id, unlocked: true, unlockedAt: new Date(), progress: 100 },
    })
  }

  await prisma.workspaceProgression.create({
    data: { userId: DEMO_USER_ID, level: 2, theme: 'neon-dreams', upgrades: ['focus_boost'] },
  })

  await prisma.memoryLane.create({
    data: { userId: DEMO_USER_ID, type: 'achievement', title: 'First Mission Completed', description: 'Completed: Explore the Dashboard', date: new Date(), significance: 5 },
  })

  await prisma.memoryLane.create({
    data: { userId: DEMO_USER_ID, type: 'milestone', title: 'Reached Level 2', description: 'Keep up the momentum!', date: new Date(Date.now() - 3600000), significance: 6 },
  })

  await prisma.xPTransaction.createMany({
    data: [
      { userId: DEMO_USER_ID, amount: 25, reason: 'mission_completed', referenceId: 'demo-mission-1', createdAt: new Date(Date.now() - 86400000) },
      { userId: DEMO_USER_ID, amount: 50, reason: 'achievement_unlocked', createdAt: new Date(Date.now() - 43200000) },
      { userId: DEMO_USER_ID, amount: 200, reason: 'focus_bonus', createdAt: new Date(Date.now() - 3600000) },
    ],
  })

  console.log('Demo data seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
