import { create } from 'zustand'
import { CampaignCreateInput, CampaignUpdateInput } from '@/core/types'
import {
  fetchCampaignsAction,
  createCampaignAction,
  updateCampaignAction,
  deleteCampaignAction,
} from '@/app/actions'

interface CampaignWithProgress {
  id: string
  userId: string
  title: string
  description: string | null
  status: string
  emoji: string | null
  color: string | null
  deadline: string | Date | null
  createdAt: string | Date
  updatedAt: string | Date
  progress: number
  totalMissions: number
  completedMissions: number
  totalXP: number
}

interface CampaignState {
  campaigns: CampaignWithProgress[]
  selectedCampaign: CampaignWithProgress | null
  isLoading: boolean
  error: string | null
  fetchCampaigns: (userId: string) => Promise<void>
  createCampaign: (input: CampaignCreateInput, userId: string) => Promise<CampaignWithProgress | null>
  updateCampaign: (id: string, input: CampaignUpdateInput, userId: string) => Promise<void>
  deleteCampaign: (id: string, userId: string) => Promise<void>
  setSelectedCampaign: (campaign: CampaignWithProgress | null) => void
}

export const useCampaignStore = create<CampaignState>((set) => ({
  campaigns: [],
  selectedCampaign: null,
  isLoading: false,
  error: null,

  fetchCampaigns: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const campaigns = await fetchCampaignsAction(userId) as CampaignWithProgress[]
      set({ campaigns, isLoading: false })
    } catch {
      set({ error: 'Failed to fetch campaigns', isLoading: false })
    }
  },

  createCampaign: async (input: CampaignCreateInput, userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const campaign = await createCampaignAction(input, userId)
      const withProgress = { ...campaign, progress: 0, totalMissions: 0, completedMissions: 0, totalXP: 0 } as CampaignWithProgress
      set(state => ({ campaigns: [withProgress, ...state.campaigns], isLoading: false }))
      return withProgress
    } catch {
      set({ error: 'Failed to create campaign', isLoading: false })
      return null
    }
  },

  updateCampaign: async (id: string, input: CampaignUpdateInput, userId: string) => {
    set({ error: null })
    try {
      const updated = await updateCampaignAction(id, input, userId)
      set(state => ({
        campaigns: state.campaigns.map(c => c.id === id ? { ...c, ...updated } as CampaignWithProgress : c),
        selectedCampaign: state.selectedCampaign?.id === id ? { ...state.selectedCampaign, ...updated } as CampaignWithProgress : state.selectedCampaign,
      }))
    } catch {
      set({ error: 'Failed to update campaign' })
    }
  },

  deleteCampaign: async (id: string, userId: string) => {
    set({ error: null })
    try {
      await deleteCampaignAction(id, userId)
      set(state => ({
        campaigns: state.campaigns.filter(c => c.id !== id),
        selectedCampaign: state.selectedCampaign?.id === id ? null : state.selectedCampaign,
      }))
    } catch {
      set({ error: 'Failed to delete campaign' })
    }
  },

  setSelectedCampaign: (campaign: CampaignWithProgress | null) => set({ selectedCampaign: campaign }),
}))
