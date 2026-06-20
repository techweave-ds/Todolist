// Mission Types
export type MissionPriority = 'low' | 'medium' | 'high' | 'critical'
export type MissionDifficulty = 'easy' | 'medium' | 'hard' | 'legendary'
export type MissionStatus = 'pending' | 'active' | 'completed' | 'archived'

export interface MissionCreateInput {
  title: string
  description?: string
  priority?: MissionPriority
  difficulty?: MissionDifficulty
  deadline?: string
  estimatedTime?: number
  campaignId?: string
  category?: string
  tags?: string[]
  dependencies?: string[]
}

export interface MissionUpdateInput {
  title?: string
  description?: string
  priority?: MissionPriority
  difficulty?: MissionDifficulty
  status?: MissionStatus
  deadline?: string | null
  estimatedTime?: number
  campaignId?: string | null
  category?: string
  tags?: string[]
  dependencies?: string[]
  progress?: number
}

// Campaign Types
export type CampaignStatus = 'active' | 'completed' | 'archived'

export interface CampaignCreateInput {
  title: string
  description?: string
  emoji?: string
  color?: string
  deadline?: string
}

export interface CampaignUpdateInput {
  title?: string
  description?: string
  emoji?: string
  color?: string
  status?: CampaignStatus
  deadline?: string | null
}

// XP Types
export interface XPCalculation {
  baseXP: number
  multiplier: number
  streakBonus: number
  focusBonus: number
  campaignBonus: number
  totalXP: number
}

export interface LevelInfo {
  currentLevel: number
  currentXP: number
  totalXP: number
  xpToNextLevel: number
  progress: number // 0-100
}

// Achievement Types
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface AchievementDefinition {
  key: string
  title: string
  description: string
  emoji: string
  rarity: AchievementRarity
  xpReward: number
  condition: Record<string, unknown>
}

// Focus Types
export type FocusSessionType = 'pomodoro' | 'custom' | 'deep_focus'

export interface FocusSessionInput {
  type: FocusSessionType
  duration: number
  environment?: string
}

// Streak Types
export type StreakType = 'daily' | 'weekly'

// Notification Types
export type NotificationType = 'achievement' | 'streak' | 'reminder' | 'focus' | 'mission' | 'system'

// Audio Types
export type AudioEnvironment = 
  | 'focus' 
  | 'mission_complete' 
  | 'level_up' 
  | 'achievement' 
  | 'streak' 
  | 'reward_capsule'
  | 'daily_briefing'
  | 'workspace_upgrade'
  | 'campaign_complete'

export interface AudioSettings {
  masterVolume: number
  musicVolume: number
  sfxVolume: number
  ambientVolume: number
  currentEnvironment?: AudioEnvironment
}

// Analytics Types
export interface AnalyticsEvent {
  event: string
  properties?: Record<string, unknown>
}

// AI Types
export type AIProvider = 'openai' | 'anthropic' | 'gemini'
export type AIGenerationType = 'goal_breakdown' | 'mission_gen' | 'campaign_create' | 'weekly_plan' | 'daily_plan' | 'coaching' | 'motivation'

export interface AIGenerationRequest {
  type: AIGenerationType
  prompt: string
  context?: Record<string, unknown>
}

export interface AIGenerationResponse {
  content: string
  model: string
  tokens?: number
}

// Memory Lane Types
export type MemoryLaneType = 'achievement' | 'milestone' | 'campaign_complete' | 'streak_record' | 'major_win'

// Workspace Types
export interface WorkspaceState {
  level: number
  theme: string
  upgrades: string[]
  ambiance?: string
  decorations: Record<string, unknown>
}

// Event Types
export type MissionEventType = 'MISSION_CREATED' | 'MISSION_UPDATED' | 'MISSION_COMPLETED' | 'MISSION_DELETED'
export type CampaignEventType = 'CAMPAIGN_CREATED' | 'CAMPAIGN_UPDATED' | 'CAMPAIGN_COMPLETED'
export type XPEventType = 'XP_GAINED' | 'LEVEL_UP'
export type AchievementEventType = 'ACHIEVEMENT_UNLOCKED'
export type StreakEventType = 'STREAK_UPDATED'
export type FocusEventType = 'FOCUS_STARTED' | 'FOCUS_ENDED'
export type AppEventType = 'DAILY_BRIEFING_OPENED' | 'REWARD_CAPSULE_OPENED'

export type AppEvent = 
  | { type: MissionEventType; payload: { missionId: string; userId: string; data?: unknown } }
  | { type: CampaignEventType; payload: { campaignId: string; userId: string; data?: unknown } }
  | { type: XPEventType; payload: { userId: string; amount: number; totalXP: number; level: number; data?: unknown } }
  | { type: AchievementEventType; payload: { userId: string; achievementKey: string; achievementTitle: string; data?: unknown } }
  | { type: StreakEventType; payload: { userId: string; currentStreak: number; longestStreak: number; data?: unknown } }
  | { type: FocusEventType; payload: { userId: string; sessionId: string; duration: number; completed: boolean; data?: unknown } }
  | { type: AppEventType; payload: { userId: string; data?: unknown } }

export type EventHandler = (event: AppEvent) => void | Promise<void>
