import { create } from 'zustand'
import { CampaignCreateInput, CampaignUpdateInput } from '@/core/types'
import { campaignService } from '@/services/campaigns/campaign-service'

interface CampaignState {
  campaigns: any[]
  selectedCampaign: any | null
  isLoading: boolean
  error: string | null
  fetchCampaigns: (userId: string) => Promise<void>
  createCampaign: (input: CampaignCreateInput, userId: string) => Promise<any>
  updateCampaign: (id: string, input: CampaignUpdateInput, userId: string) => Promise<void>
  deleteCampaign: (id: string, userId: string) => Promise<void>
  setSelectedCampaign: (campaign: any | null) => void
}

export const useCampaignStore = create<CampaignState>((set) => ({
  campaigns: [],
  selectedCampaign: null,
  isLoading: false,
  error: null,

  fetchCampaigns: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const campaigns = await campaignService.getByUser(userId)
      set({ campaigns, isLoading: false })
    } catch (error) {
      set({ error: 'Failed to fetch campaigns', isLoading: false })
    }
  },

  createCampaign: async (input: CampaignCreateInput, userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const campaign = await campaignService.create(input, userId)
      set(state => ({ campaigns: [campaign, ...state.campaigns], isLoading: false }))
      return campaign
    } catch (error) {
      set({ error: 'Failed to create campaign', isLoading: false })
      return null
    }
  },

  updateCampaign: async (id: string, input: CampaignUpdateInput, userId: string) => {
    set({ error: null })
    try {
      const updated = await campaignService.update(id, input, userId)
      set(state => ({
        campaigns: state.campaigns.map(c => c.id === id ? { ...c, ...updated } : c),
        selectedCampaign: state.selectedCampaign?.id === id ? updated : state.selectedCampaign,
      }))
    } catch (error) {
      set({ error: 'Failed to update campaign' })
    }
  },

  deleteCampaign: async (id: string, userId: string) => {
    set({ error: null })
    try {
      await campaignService.delete(id, userId)
      set(state => ({
        campaigns: state.campaigns.filter(c => c.id !== id),
        selectedCampaign: state.selectedCampaign?.id === id ? null : state.selectedCampaign,
      }))
    } catch (error) {
      set({ error: 'Failed to delete campaign' })
    }
  },

  setSelectedCampaign: (campaign) => set({ selectedCampaign: campaign }),
}))
