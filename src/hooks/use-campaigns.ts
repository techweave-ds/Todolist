'use client'

import { useEffect } from 'react'
import { useCampaignStore } from '@/store/campaign-store'

export function useCampaigns(userId: string | undefined) {
  const { campaigns, isLoading, error, fetchCampaigns, createCampaign, updateCampaign, deleteCampaign } = useCampaignStore()

  useEffect(() => {
    if (userId) {
      fetchCampaigns(userId)
    }
  }, [userId, fetchCampaigns])

  return {
    campaigns,
    isLoading,
    error,
    createCampaign,
    updateCampaign,
    deleteCampaign,
  }
}
