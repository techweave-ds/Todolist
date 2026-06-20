export type MissionStatus = "PENDING" | "ACTIVE" | "COMPLETED" | "ARCHIVED";
export type MissionDifficulty = "EASY" | "MEDIUM" | "HARD" | "LEGENDARY";
export type MissionPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Mission {
  id: string;
  userId: string;
  campaignId: string | null;
  title: string;
  description: string | null;
  status: MissionStatus;
  difficulty: MissionDifficulty;
  priority: MissionPriority;
  deadline: string | null;
  estimatedTime: number | null;
  xpReward: number;
  progress: number;
  tags: string[];
  categoryId: string | null;
  parentId: string | null;
  sortOrder: number;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  campaign?: { id: string; title: string } | null;
  subtasks?: { id: string; title: string; completed: boolean }[];
}

export interface CreateMissionInput {
  title: string;
  description?: string;
  difficulty?: MissionDifficulty;
  priority?: MissionPriority;
  deadline?: string;
  estimatedTime?: number;
  tags?: string[];
  campaignId?: string;
  categoryId?: string;
  parentId?: string;
}

export interface UpdateMissionInput {
  title?: string;
  description?: string;
  status?: MissionStatus;
  difficulty?: MissionDifficulty;
  priority?: MissionPriority;
  deadline?: string | null;
  estimatedTime?: number;
  tags?: string[];
  campaignId?: string | null;
  categoryId?: string | null;
  progress?: number;
}
