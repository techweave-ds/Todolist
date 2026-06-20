export type AchievementCategory = "PRODUCTIVITY" | "STREAKS" | "MISSIONS" | "CAMPAIGNS" | "FOCUS" | "SPECIAL" | "MILESTONE";

export interface Achievement {
  id: string;
  key: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  rarity: string;
  xpReward: number;
  condition: Record<string, unknown>;
  secret: boolean;
  createdAt: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  progress: number;
  maxProgress: number;
  unlockedAt: string | null;
  achievement?: Achievement;
}
