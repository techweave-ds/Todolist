export type FocusSessionType = "POMODORO" | "CUSTOM" | "DEEP_FOCUS";

export interface FocusSession {
  id: string;
  userId: string;
  type: FocusSessionType | string;
  duration: number;
  actualDuration: number | null;
  completed: boolean;
  interruptions?: number;
  focusScore?: number | null;
  environment: string | null;
  missionId?: string | null;
  notes: string | null;
  score?: number | null;
  distractions?: number;
  startedAt: string | Date;
  endedAt: string | Date | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
