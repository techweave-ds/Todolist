export type MemoryLaneType = "achievement" | "milestone" | "campaign" | "streak" | "custom";

export interface MemoryLaneEntry {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  type: MemoryLaneType | string;
  metadata: Record<string, unknown> | null | unknown;
  date: string | Date;
  createdAt: string | Date;
}
