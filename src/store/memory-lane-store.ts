import { create } from 'zustand'
import { memoryLaneService } from '@/services/memory-lane/memory-lane-service'

interface MemoryLaneState {
  entries: any[]
  timeline: any[]
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
      set({ entries, timeline, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },
}))
