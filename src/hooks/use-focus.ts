'use client'

import { useEffect } from 'react'
import { useFocusStore } from '@/store/focus-store'

export function useFocus(userId: string | undefined) {
  const { sessions, statistics, weeklyData, isLoading, error, startSession, endSession, fetchHistory, fetchStats, fetchWeeklyData } = useFocusStore()

  useEffect(() => {
    if (userId) {
      fetchHistory(userId)
      fetchStats(userId)
      fetchWeeklyData(userId)
    }
  }, [userId, fetchHistory, fetchStats, fetchWeeklyData])

  return {
    sessions,
    statistics,
    weeklyData,
    isLoading,
    error,
    startSession,
    endSession,
  }
}
