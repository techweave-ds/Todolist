export type NotificationType = "MISSION_REMINDER" | "STREAK_ALERT" | "ACHIEVEMENT_UNLOCKED" | "LEVEL_UP" | "DAILY_BRIEFING" | "CAMPAIGN_MILESTONE" | "REWARD_CAPSULE" | "FOCUS_SUGGESTION";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string | null;
  data: Record<string, unknown> | null;
  read: boolean;
  createdAt: string;
}
