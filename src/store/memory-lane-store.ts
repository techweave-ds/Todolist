import { create } from 'zustand'
import { MemoryLaneEntry } from '@/core/types/memory-lane'
import { memoryLaneService } from '@/services/memory-lane/memory-lane-service'

interface TimelineGroup {
  date: string
  items: MemoryLaneEntry[]
  significance: number
}

interface MemoryLaneState {
  entries: MemoryLaneEntry[]
  timeline: TimelineGroup[]
  isLoading: boolean
  fetchMemoryLane: (userId: string) => Promise<void>
}

export const useMemoryLaneStore = create<MemoryLaneState>((set) => ({
  entries: [],
  timeline: [],
  isLoading: false,

  fetchMemoryLane: async (userId: string) => {
    set({ isLoading: true })
    try {
      const [entries, timeline] = await Promise.all([
        memoryLaneService.getEntries(userId),
        memoryLaneService.getTimeline(userId),
      ])
      set({ entries: entries as MemoryLaneEntry[], timeline: timeline as TimelineGroup[], isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },
}))
