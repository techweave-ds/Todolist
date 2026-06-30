import { create } from 'zustand'
import { MissionCreateInput, MissionUpdateInput } from '@/core/types'
import { missionService } from '@/services/missions/mission-service'

interface Mission {
  id: string
  userId: string
  campaignId: string | null
  title: string
  description: string | null
  status: string
  difficulty: string
  priority: string
  deadline: string | Date | null
  estimatedTime: number | null
  xpReward: number
  progress: number
  tags: string[]
  category: string | null
  completedAt: string | Date | null
  createdAt: string | Date
  updatedAt: string | Date
  campaign?: { id: string; title: string } | null
  subtasks?: { id: string; title: string; completed: boolean }[]
}

interface MissionState {
  missions: Mission[]
  selectedMission: Mission | null
  isLoading: boolean
  error: string | null
  fetchMissions: (userId: string) => Promise<void>
  createMission: (input: MissionCreateInput, userId: string) => Promise<Mission | null>
  updateMission: (id: string, input: MissionUpdateInput, userId: string) => Promise<void>
  completeMission: (id: string, userId: string) => Promise<Mission | null>
  deleteMission: (id: string, userId: string) => Promise<void>
  setSelectedMission: (mission: Mission | null) => void
}

export const useMissionStore = create<MissionState>((set, get) => ({
  missions: [],
  selectedMission: null,
  isLoading: false,
  error: null,

  fetchMissions: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const missions = await missionService.getByUser(userId)
      set({ missions, isLoading: false })
    } catch (error) {
      set({ error: 'Failed to fetch missions', isLoading: false })
    }
  },

  createMission: async (input: MissionCreateInput, userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const mission = await missionService.create(input, userId)
      set(state => ({ missions: [mission, ...state.missions], isLoading: false }))
      return mission
    } catch (error) {
      set({ error: 'Failed to create mission', isLoading: false })
      return null
    }
  },

  updateMission: async (id: string, input: MissionUpdateInput, userId: string) => {
    set({ error: null })
    try {
      const updated = await missionService.update(id, input, userId)
      set(state => ({
        missions: state.missions.map(m => m.id === id ? { ...m, ...updated } : m),
        selectedMission: state.selectedMission?.id === id ? updated : state.selectedMission,
      }))
    } catch (error) {
      set({ error: 'Failed to update mission' })
    }
  },

  completeMission: async (id: string, userId: string) => {
    set({ error: null })
    try {
      const completed = await missionService.complete(id, userId)
      set(state => ({
        missions: state.missions.map(m => m.id === id ? { ...m, ...completed } : m),
        selectedMission: state.selectedMission?.id === id ? completed : state.selectedMission,
      }))
      return completed as Mission | null
    } catch (error) {
      set({ error: 'Failed to complete mission' })
      return null
    }
  },

  deleteMission: async (id: string, userId: string) => {
    set({ error: null })
    try {
      await missionService.delete(id, userId)
      set(state => ({
        missions: state.missions.filter(m => m.id !== id),
        selectedMission: state.selectedMission?.id === id ? null : state.selectedMission,
      }))
    } catch (error) {
      set({ error: 'Failed to delete mission' })
    }
  },

  setSelectedMission: (mission) => set({ selectedMission: mission }),
}))
