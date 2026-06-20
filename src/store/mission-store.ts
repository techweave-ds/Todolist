import { create } from 'zustand'
import { MissionCreateInput, MissionUpdateInput } from '@/core/types'
import { missionService } from '@/services/missions/mission-service'

interface MissionState {
  missions: any[]
  selectedMission: any | null
  isLoading: boolean
  error: string | null
  fetchMissions: (userId: string) => Promise<void>
  createMission: (input: MissionCreateInput, userId: string) => Promise<any>
  updateMission: (id: string, input: MissionUpdateInput, userId: string) => Promise<void>
  completeMission: (id: string, userId: string) => Promise<void>
  deleteMission: (id: string, userId: string) => Promise<void>
  setSelectedMission: (mission: any | null) => void
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
    } catch (error) {
      set({ error: 'Failed to complete mission' })
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
