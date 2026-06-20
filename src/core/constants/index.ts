export const XP = {
  EASY: 25,
  MEDIUM: 50,
  HARD: 100,
  LEGENDARY: 250,
  DAILY_BONUS: 10,
  STREAK_MULTIPLIER: 0.1, // 10% per day of streak
  FOCUS_BONUS: 0.2, // 20% bonus
  CAMPAIGN_BONUS: 0.15, // 15% bonus
} as const

export const LEVELS = {
  BASE_XP: 100,
  SCALE_FACTOR: 1.5,
  MAX_LEVEL: 100,
} as const

export const FOCUS = {
  POMODORO_DURATION: 25,
  SHORT_BREAK: 5,
  LONG_BREAK: 15,
  POMODOROS_BEFORE_LONG_BREAK: 4,
} as const

export const STREAK = {
  FREEZE_COST: 50,
} as const

export const ACHIEVEMENTS = {
  FIRST_MISSION: {
    key: 'first_mission',
    title: 'First Mission',
    description: 'Complete your first mission',
    emoji: '🎯',
    rarity: 'common' as const,
    xpReward: 50,
    condition: { missionsCompleted: 1 },
  },
  STREAK_7: {
    key: 'streak_7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    emoji: '🔥',
    rarity: 'rare' as const,
    xpReward: 200,
    condition: { streak: 7 },
  },
  STREAK_30: {
    key: 'streak_30',
    title: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    emoji: '💪',
    rarity: 'epic' as const,
    xpReward: 500,
    condition: { streak: 30 },
  },
  MISSIONS_10: {
    key: 'missions_10',
    title: 'Getting Started',
    description: 'Complete 10 missions',
    emoji: '📋',
    rarity: 'common' as const,
    xpReward: 100,
    condition: { missionsCompleted: 10 },
  },
  MISSIONS_50: {
    key: 'missions_50',
    title: 'Mission Machine',
    description: 'Complete 50 missions',
    emoji: '⚡',
    rarity: 'rare' as const,
    xpReward: 300,
    condition: { missionsCompleted: 50 },
  },
  MISSIONS_100: {
    key: 'missions_100',
    title: 'Century Club',
    description: 'Complete 100 missions',
    emoji: '🏆',
    rarity: 'epic' as const,
    xpReward: 600,
    condition: { missionsCompleted: 100 },
  },
  CAMPAIGN_FINISHER: {
    key: 'campaign_finisher',
    title: 'Campaign Finisher',
    description: 'Complete your first campaign',
    emoji: '🎉',
    rarity: 'rare' as const,
    xpReward: 250,
    condition: { campaignsCompleted: 1 },
  },
  FOCUS_MASTER: {
    key: 'focus_master',
    title: 'Focus Master',
    description: 'Complete 10 focus sessions',
    emoji: '🧘',
    rarity: 'common' as const,
    xpReward: 100,
    condition: { focusSessions: 10 },
  },
  FOCUS_100: {
    key: 'focus_100',
    title: 'Deep Focus',
    description: 'Complete 100 focus sessions',
    emoji: '🧠',
    rarity: 'epic' as const,
    xpReward: 500,
    condition: { focusSessions: 100 },
  },
  EARLY_BIRD: {
    key: 'early_bird',
    title: 'Early Bird',
    description: 'Complete a mission before 8 AM',
    emoji: '🌅',
    rarity: 'rare' as const,
    xpReward: 150,
    condition: { beforeHour: 8 },
  },
  NIGHT_OWL: {
    key: 'night_owl',
    title: 'Night Owl',
    description: 'Complete a mission after 10 PM',
    emoji: '🦉',
    rarity: 'rare' as const,
    xpReward: 150,
    condition: { afterHour: 22 },
  },
  LEVEL_5: {
    key: 'level_5',
    title: 'Rising Star',
    description: 'Reach level 5',
    emoji: '⭐',
    rarity: 'common' as const,
    xpReward: 100,
    condition: { level: 5 },
  },
  LEVEL_10: {
    key: 'level_10',
    title: 'Power User',
    description: 'Reach level 10',
    emoji: '🌟',
    rarity: 'rare' as const,
    xpReward: 300,
    condition: { level: 10 },
  },
  LEVEL_25: {
    key: 'level_25',
    title: 'Legend in the Making',
    description: 'Reach level 25',
    emoji: '💫',
    rarity: 'epic' as const,
    xpReward: 800,
    condition: { level: 25 },
  },
} as const

export const REWARD_CAPSULE_COLORS = ['blue', 'purple', 'gold', 'rainbow'] as const

export const THEMES = [
  { id: 'neon-dreams', name: 'Neon Dreams', description: 'Vibrant neon on dark' },
  { id: 'deep-space', name: 'Deep Space', description: 'Cosmic dark theme' },
  { id: 'midnight-ocean', name: 'Midnight Ocean', description: 'Deep blues and teals' },
  { id: 'aurora-borealis', name: 'Aurora Borealis', description: 'Northern lights inspired' },
  { id: 'cyber-synth', name: 'Cyber Synth', description: 'Retro-wave aesthetic' },
  { id: 'minimal-light', name: 'Minimal Light', description: 'Clean, bright interface' },
] as const

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Missions', href: '/missions', icon: 'Target' },
  { label: 'Campaigns', href: '/campaigns', icon: 'Flag' },
  { label: 'Focus', href: '/focus', icon: 'Brain' },
  { label: 'Achievements', href: '/achievements', icon: 'Trophy' },
  { label: 'Analytics', href: '/analytics', icon: 'BarChart3' },
  { label: 'Memory Lane', href: '/memory-lane', icon: 'History' },
] as const
