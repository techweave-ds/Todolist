export type FocusSessionType = "POMODORO" | "CUSTOM" | "DEEP_FOCUS";

export interface FocusSession {
  id: string;
  userId: string;
  type: FocusSessionType;
  duration: number;
  actualDuration: number | null;
  completed: boolean;
  interruptions: number;
  focusScore: number | null;
  environment: string | null;
  missionId: string | null;
  notes: string | null;
  startedAt: string;
  endedAt: string | null;
}
