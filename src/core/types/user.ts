export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  createdAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  timezone: string;
  theme: string;
  onboardingCompleted: boolean;
}

export interface UserProgress {
  id: string;
  userId: string;
  level: number;
  currentXp: number;
  totalXp: number;
  xpToNextLevel: number;
  prestige: number;
}
