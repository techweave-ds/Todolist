export interface Streak {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  streakFreezes: number;
}

export interface StreakUpdate {
  currentStreak: number;
  longestStreak: number;
  streakBroken: boolean;
}
