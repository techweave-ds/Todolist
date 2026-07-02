import { create } from 'zustand'
import { MissionCreateInput, MissionUpdateInput } from '@/core/types'
import {
  fetchMissionsAction,
  createMissionAction,
  updateMissionAction,
  completeMissionAction,
  reopenMissionAction,
  deleteMissionAction,
} from '@/app/actions'
import { eventBus } from '@/core/events'

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
  remindAt: string | Date | null
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
  reopenMission: (id: string, userId: string) => Promise<void>
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
    const result = await fetchMissionsAction(userId)
    if ('error' in result) {
      set({ error: `Failed to fetch missions: ${result.error}`, isLoading: false })
      return
    }
    set({ missions: result.data, isLoading: false })
  },

  createMission: async (input: MissionCreateInput, userId: string) => {
    set({ error: null })
    const result = await createMissionAction(input, userId)
    if ('error' in result) {
      set({ error: `Failed to create mission: ${result.error}` })
      return null
    }
    set(state => ({ missions: [result.data, ...state.missions] }))
    return result.data
  },

  updateMission: async (id: string, input: MissionUpdateInput, userId: string) => {
    set({ error: null })
    const result = await updateMissionAction(id, input, userId)
    if ('error' in result) {
      set({ error: `Failed to update mission: ${result.error}` })
      return
    }
    set(state => ({
      missions: state.missions.map(m => m.id === id ? { ...m, ...result.data } : m),
      selectedMission: state.selectedMission?.id === id ? result.data : state.selectedMission,
    }))
  },

  completeMission: async (id: string, userId: string) => {
    set({ error: null })
    const result = await completeMissionAction(id, userId)
    if ('error' in result) {
      set({ error: `Failed to complete mission: ${result.error}` })
      return null
    }
    set(state => ({
      missions: state.missions.map(m => m.id === id ? { ...m, ...result.data } : m),
      selectedMission: state.selectedMission?.id === id ? result.data : state.selectedMission,
    }))
    eventBus.emit({ type: 'MISSION_COMPLETED', payload: { missionId: id, userId } })
    eventBus.emit({ type: 'XP_GAINED', payload: { userId, amount: (result.data as any)?.xpReward || 0, totalXP: 0, level: 0 } })
    eventBus.emit({ type: 'REWARD_CAPSULE_OPENED', payload: { userId } })
    return result.data as Mission | null
  },

  reopenMission: async (id: string, userId: string) => {
    set({ error: null })
    const result = await reopenMissionAction(id, userId)
    if ('error' in result) {
      set({ error: `Failed to reopen mission: ${result.error}` })
      return
    }
    set(state => ({
      missions: state.missions.map(m => m.id === id ? { ...m, ...result.data } : m),
      selectedMission: state.selectedMission?.id === id ? result.data : state.selectedMission,
    }))
  },

  deleteMission: async (id: string, userId: string) => {
    set({ error: null })
    const result = await deleteMissionAction(id, userId)
    if ('error' in result) {
      set({ error: `Failed to delete mission: ${result.error}` })
      return
    }
    set(state => ({
      missions: state.missions.filter(m => m.id !== id),
      selectedMission: state.selectedMission?.id === id ? null : state.selectedMission,
    }))
  },

  setSelectedMission: (mission) => set({ selectedMission: mission }),
}))
