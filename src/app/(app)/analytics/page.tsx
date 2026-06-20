'use client'

import { useEffect } from 'react'
import { useAnalyticsStore } from '@/store/analytics-store'
import { useAppStore } from '@/store/app-store'
import { Target, Brain, TrendingUp, Zap } from 'lucide-react'

export default function AnalyticsPage() {
  const { userId } = useAppStore()
  const { stats, completionRate, focusData, categoryData, fetchAnalytics } = useAnalyticsStore()

  useEffect(() => {
    if (userId) fetchAnalytics(userId)
  }, [userId, fetchAnalytics])

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">Track your productivity metrics</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Completion Rate</span>
          </div>
          <p className="text-2xl font-bold">{completionRate?.rate || 0}%</p>
          <p className="text-xs text-muted-foreground">{completionRate?.completed || 0}/{completionRate?.total || 0} missions</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-4 h-4 text-green-500" />
            <span className="text-xs text-muted-foreground">Focus Time</span>
          </div>
          <p className="text-2xl font-bold">{focusData?.totalMinutes || 0}m</p>
          <p className="text-xs text-muted-foreground">{focusData?.totalSessions || 0} sessions</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-muted-foreground">Level</span>
          </div>
          <p className="text-2xl font-bold">{stats?.level || 1}</p>
          <p className="text-xs text-muted-foreground">{stats?.totalXP || 0} total XP</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-muted-foreground">Streak</span>
          </div>
          <p className="text-2xl font-bold">{stats?.dailyStreak || 0}d</p>
          <p className="text-xs text-muted-foreground">Best: {stats?.longestStreak || 0}d</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="glass rounded-xl p-4">
          <h2 className="text-sm font-medium mb-3">Category Distribution</h2>
          {categoryData && Object.keys(categoryData).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(categoryData).map(([cat, data]: [string, any]) => (
                <div key={cat}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="capitalize">{cat}</span>
                    <span className="text-muted-foreground">{data.completed}/{data.total}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${(data.completed / Math.max(data.total, 1)) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">No category data yet</p>
          )}
        </div>

        <div className="glass rounded-xl p-4">
          <h2 className="text-sm font-medium mb-3">Recent Focus Sessions</h2>
          {focusData?.dailyData && Object.keys(focusData.dailyData).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(focusData.dailyData).slice(-7).reverse().map(([date, minutes]: [string, any]) => (
                <div key={date} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-12">{new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-teal-500" style={{ width: `${Math.min((minutes / 120) * 100, 100)}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-10 text-right">{minutes}m</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">No focus data yet</p>
          )}
        </div>
      </div>

      <div className="glass rounded-xl p-4">
        <h2 className="text-sm font-medium mb-3">Quick Stats</h2>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total Missions</p>
            <p className="text-lg font-bold">{stats?.totalMissionsCompleted || 0}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Active Campaigns</p>
            <p className="text-lg font-bold">{stats?.activeCampaigns || 0}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Focus Sessions</p>
            <p className="text-lg font-bold">{stats?.focusSessions || 0}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg Session</p>
            <p className="text-lg font-bold">{focusData?.averagePerSession || 0}m</p>
          </div>
        </div>
      </div>
    </div>
  )
}
