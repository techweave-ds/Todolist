export type AchievementCategory = "PRODUCTIVITY" | "STREAKS" | "MISSIONS" | "CAMPAIGNS" | "FOCUS" | "SPECIAL" | "MILESTONE";

export interface Achievement {
  id: string;
  key: string;
  title: string;
  description: string | null;
  category?: AchievementCategory;
  icon?: string;
  rarity: string;
  xpReward: number;
  condition: unknown;
  secret?: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date;
  emoji?: string | null;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  progress: number;
  unlockedAt: string | Date | null;
  achievement?: Achievement;
}
