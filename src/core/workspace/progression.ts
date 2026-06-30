export type AmbientMode = 'morning' | 'afternoon' | 'evening' | 'night' | 'rain' | 'forest' | 'space'

export interface UnlockCondition {
  missionsCompleted?: number
  focusSessions?: number
  level?: number
  campaignsCompleted?: number
  achievementsUnlocked?: number
  streakDays?: number
  focusHours?: number
}

export interface WorkspaceObject {
  id: string
  name: string
  stage: number
  condition: UnlockCondition
}

export const WORKSPACE_OBJECTS: WorkspaceObject[] = [
  // Stage 1 — always unlocked
  { id: 'desk', name: 'Desk', stage: 1, condition: {} },
  { id: 'laptop', name: 'Laptop', stage: 1, condition: {} },
  { id: 'chair', name: 'Chair', stage: 1, condition: {} },
  { id: 'floor', name: 'Floor', stage: 1, condition: {} },
  { id: 'walls', name: 'Walls', stage: 1, condition: {} },
  { id: 'basic-lighting', name: 'Basic Lighting', stage: 1, condition: {} },

  // Stage 2
  { id: 'desk-plant', name: 'Desk Plant', stage: 2, condition: { missionsCompleted: 10 } },
  { id: 'desk-lamp', name: 'Desk Lamp', stage: 2, condition: { focusSessions: 25 } },
  { id: 'dual-monitors', name: 'Dual Monitors', stage: 2, condition: { level: 5 } },
  { id: 'mechanical-keyboard', name: 'Mechanical Keyboard', stage: 2, condition: { missionsCompleted: 5 } },

  // Stage 3
  { id: 'bookshelf', name: 'Bookshelf', stage: 3, condition: { campaignsCompleted: 1 } },
  { id: 'large-monitor', name: 'Large Monitor', stage: 3, condition: { level: 10 } },
  { id: 'artwork', name: 'Artwork', stage: 3, condition: { missionsCompleted: 50 } },
  { id: 'soft-lighting', name: 'Soft Lighting', stage: 3, condition: { focusSessions: 50 } },
  { id: 'clock', name: 'Clock', stage: 3, condition: { focusHours: 10 } },

  // Stage 4
  { id: 'standing-desk', name: 'Standing Desk', stage: 4, condition: { missionsCompleted: 100 } },
  { id: 'premium-chair', name: 'Premium Chair', stage: 4, condition: { level: 15 } },
  { id: 'ambient-lighting', name: 'Ambient Lighting', stage: 4, condition: { focusSessions: 100 } },
  { id: 'awards-shelf', name: 'Awards Shelf', stage: 4, condition: { achievementsUnlocked: 5 } },
  { id: 'mission-display', name: 'Mission Display', stage: 4, condition: { campaignsCompleted: 3 } },

  // Stage 5
  { id: 'executive-desk', name: 'Executive Desk', stage: 5, condition: { level: 25 } },
  { id: 'panoramic-window', name: 'Panoramic Window', stage: 5, condition: { streakDays: 30 } },
  { id: 'digital-wall', name: 'Digital Wall', stage: 5, condition: { missionsCompleted: 200 } },
  { id: 'premium-furniture', name: 'Premium Furniture', stage: 5, condition: { campaignsCompleted: 5 } },
  { id: 'achievement-shelf', name: 'Achievement Shelf', stage: 5, condition: { achievementsUnlocked: 10 } },
  { id: 'command-center', name: 'Command Center', stage: 5, condition: { level: 30 } },
]

export function getStageForLevel(level: number): number {
  if (level >= 30) return 5
  if (level >= 15) return 4
  if (level >= 10) return 3
  if (level >= 5) return 2
  return 1
}

export const AMBIENT_MODES: { id: AmbientMode; label: string; description: string }[] = [
  { id: 'morning', label: 'Morning', description: 'Warm sunlight' },
  { id: 'afternoon', label: 'Afternoon', description: 'Bright neutral' },
  { id: 'evening', label: 'Evening', description: 'Golden hour' },
  { id: 'night', label: 'Night', description: 'Soft blue' },
  { id: 'rain', label: 'Rain', description: 'Rain on windows' },
  { id: 'forest', label: 'Forest', description: 'Nature ambience' },
  { id: 'space', label: 'Space', description: 'Stars and planets' },
]
