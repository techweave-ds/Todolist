import { create } from 'zustand'
import { AmbientMode, WORKSPACE_OBJECTS, UnlockCondition } from '@/core/workspace/progression'

export interface UserStats {
  missionsCompleted: number
  focusSessions: number
  level: number
  campaignsCompleted: number
  achievementsUnlocked: number
  streakDays: number
  focusHours: number
}

interface UnlockEvent {
  objectId: string
  objectName: string
  stage: number
}

interface WorkspaceState {
  unlockedObjectIds: string[]
  currentStage: number
  ambientMode: AmbientMode
  autoRotate: boolean
  reduceMotion: boolean
  lastUnlock: UnlockEvent | null
  dustIntensity: number
  setUserStats: (stats: Partial<UserStats>) => void
  checkUnlocks: (stats: UserStats) => void
  setAmbientMode: (mode: AmbientMode) => void
  setAutoRotate: (v: boolean) => void
  setReduceMotion: (v: boolean) => void
  dismissUnlock: () => void
}

function meetsCondition(stats: UserStats, condition: UnlockCondition): boolean {
  if (condition.missionsCompleted !== undefined && stats.missionsCompleted < condition.missionsCompleted) return false
  if (condition.focusSessions !== undefined && stats.focusSessions < condition.focusSessions) return false
  if (condition.level !== undefined && stats.level < condition.level) return false
  if (condition.campaignsCompleted !== undefined && stats.campaignsCompleted < condition.campaignsCompleted) return false
  if (condition.achievementsUnlocked !== undefined && stats.achievementsUnlocked < condition.achievementsUnlocked) return false
  if (condition.streakDays !== undefined && stats.streakDays < condition.streakDays) return false
  if (condition.focusHours !== undefined && stats.focusHours < condition.focusHours) return false
  return true
}

function computeStage(objectIds: string[]): number {
  let max = 1
  for (const obj of WORKSPACE_OBJECTS) {
    if (objectIds.includes(obj.id) && obj.stage > max) {
      max = obj.stage
    }
  }
  return max
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  unlockedObjectIds: ['desk', 'laptop', 'chair', 'floor', 'walls', 'basic-lighting'],
  currentStage: 1,
  ambientMode: 'morning',
  autoRotate: true,
  reduceMotion: false,
  lastUnlock: null,
  dustIntensity: 0.3,

  setUserStats: () => {},

  checkUnlocks: (stats: UserStats) => {
    const newlyUnlocked: UnlockEvent[] = []

    for (const obj of WORKSPACE_OBJECTS) {
      if (meetsCondition(stats, obj.condition)) {
        newlyUnlocked.push({ objectId: obj.id, objectName: obj.name, stage: obj.stage })
      }
    }

    const ids = newlyUnlocked.map(u => u.objectId)
    const stage = computeStage(ids)
    const latest = newlyUnlocked.length > 0 ? newlyUnlocked[newlyUnlocked.length - 1] : null

    set({
      unlockedObjectIds: ids,
      currentStage: stage,
      lastUnlock: latest,
    })
  },

  setAmbientMode: (mode) => set({ ambientMode: mode }),
  setAutoRotate: (v) => set({ autoRotate: v }),
  setReduceMotion: (v) => set({ reduceMotion: v }),
  dismissUnlock: () => set({ lastUnlock: null }),
}))
