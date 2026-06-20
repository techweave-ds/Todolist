export interface Reward {
  type: "xp" | "achievement" | "badge" | "cosmetic" | "capsule";
  amount?: number;
  id?: string;
  metadata?: Record<string, unknown>;
}

export interface XpTransaction {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  multiplier: number;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface LevelUpResult {
  oldLevel: number;
  newLevel: number;
  rewards: Reward[];
}

export interface RewardCapsule {
  id: string;
  userId: string;
  type: "daily" | "streak" | "milestone" | "achievement";
  rewards: Reward[];
  opened: boolean;
  createdAt: string;
}
