'use client'

import { useEffect } from 'react'
import { useMissionStore } from '@/store/mission-store'

export function useMissions(userId: string | undefined) {
  const { missions, isLoading, error, fetchMissions, createMission, updateMission, completeMission, deleteMission } = useMissionStore()

  useEffect(() => {
    if (userId) {
      fetchMissions(userId)
    }
  }, [userId, fetchMissions])

  return {
    missions,
    isLoading,
    error,
    createMission,
    updateMission,
    completeMission,
    deleteMission,
  }
}
