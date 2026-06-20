export type MemoryLaneType = "achievement" | "milestone" | "campaign" | "streak" | "custom";

export interface MemoryLaneEntry {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  type: MemoryLaneType;
  metadata: Record<string, unknown> | null;
  date: string;
  createdAt: string;
}
