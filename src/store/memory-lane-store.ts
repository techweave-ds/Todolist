import { create } from 'zustand'
import { getMemoryLaneEntriesAction, getMemoryLaneTimelineAction } from '@/app/actions'

interface MemoryLaneEntry {
  id: string
  type: string
  title: string
  description: string | null
  data: Record<string, unknown> | null
  importance: number
  createdAt: string | Date
}

interface TimelineGroup {
  year: number
  entries: MemoryLaneEntry[]
}

interface MemoryLaneState {
  entries: MemoryLaneEntry[]
  timeline: TimelineGroup[]
  isLoading: boolean
  error: string | null
  fetchMemoryLane: (userId: string) => Promise<void>
}

export const useMemoryLaneStore = create<MemoryLaneState>((set) => ({
  entries: [],
  timeline: [],
  isLoading: false,
  error: null,

  fetchMemoryLane: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const [entries, timeline] = await Promise.all([
        getMemoryLaneEntriesAction(userId) as any,
        getMemoryLaneTimelineAction(userId) as any,
      ])
      set({ entries, timeline, isLoading: false })
    } catch {
      set({ error: 'Failed to fetch memory lane', isLoading: false })
    }
  },
}))
