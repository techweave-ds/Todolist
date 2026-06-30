'use client'

import { useEffect } from 'react'
import { WorkspaceScene } from '@/components/workspace/workspace-scene'
import { UnlockNotification } from '@/components/workspace/unlock-animation'
import { useWorkspaceStore, UserStats } from '@/store/workspace-store'
import { useAppStore } from '@/store/app-store'
import { useXPStore } from '@/store/xp-store'
import { AMBIENT_MODES, AmbientMode } from '@/core/workspace/progression'
import { Sparkles, Sun, RotateCcw, Eye, Zap } from 'lucide-react'

const STAGE_LABELS = ['', 'Cadet Desk', 'Operational', 'Advanced', 'Elite', 'Command Center']

export default function WorkspacePage() {
  const { dashboardStats, fetchDashboardStats, userId } = useAppStore()
  const { level } = useXPStore()
  const {
    currentStage, ambientMode, autoRotate, reduceMotion,
    setAmbientMode, setAutoRotate, setReduceMotion, checkUnlocks
  } = useWorkspaceStore()

  useEffect(() => {
    if (!userId) return
    fetchDashboardStats(userId)
  }, [userId, fetchDashboardStats])

  useEffect(() => {
    if (!dashboardStats) return
    const stats: UserStats = {
      missionsCompleted: dashboardStats.totalMissionsCompleted || 0,
      focusSessions: dashboardStats.focusSessions || 0,
      level: dashboardStats.level || 1,
      campaignsCompleted: dashboardStats.activeCampaigns || 0,
      achievementsUnlocked: dashboardStats.recentAchievements?.length || 0,
      streakDays: dashboardStats.dailyStreak || 0,
      focusHours: Math.floor((dashboardStats.focusMinutes || 0) / 60),
    }
    checkUnlocks(stats)
  }, [dashboardStats, checkUnlocks])

  return (
    <div className="space-y-4 animate-slide-up">
      <UnlockNotification />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Living Workspace</h1>
          <p className="text-sm text-muted-foreground">{STAGE_LABELS[currentStage]} &middot; Stage {currentStage}/5</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Lv.{level}</span>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/50">
            <Zap className="w-3 h-3 text-yellow-500" />
            <span className="text-xs font-medium">{currentStage}</span>
          </div>
        </div>
      </div>

      <div className="h-[500px] lg:h-[600px] glass rounded-2xl overflow-hidden">
        <WorkspaceScene />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="w-3.5 h-3.5 text-yellow-500" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Ambience</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {AMBIENT_MODES.map(m => (
              <button
                key={m.id}
                onClick={() => setAmbientMode(m.id)}
                className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                  ambientMode === m.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Stage Progress</span>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map(s => (
              <div
                key={s}
                className={`w-8 h-1.5 rounded-full transition-all ${
                  s <= currentStage ? 'bg-gradient-to-r from-primary to-accent' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5">
            {STAGE_LABELS[currentStage]}
          </p>
        </div>

        <div className="glass rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <RotateCcw className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Controls</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all ${
                autoRotate ? 'bg-primary/20 text-primary' : 'bg-muted/50 text-muted-foreground'
              }`}
            >
              Auto-rotate {autoRotate ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => setReduceMotion(!reduceMotion)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all ${
                reduceMotion ? 'bg-primary/20 text-primary' : 'bg-muted/50 text-muted-foreground'
              }`}
            >
              <Eye className="w-3 h-3 inline mr-1" />
              {reduceMotion ? 'Low' : 'Full'}
            </button>
          </div>
        </div>

        <div className="glass rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-3.5 h-3.5 text-accent" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Objects</span>
          </div>
          <p className="text-lg font-bold">{currentStage === 1 ? 6 : currentStage === 2 ? 10 : currentStage === 3 ? 15 : currentStage === 4 ? 20 : 26}</p>
          <p className="text-[10px] text-muted-foreground">workspace objects</p>
        </div>
      </div>
    </div>
  )
}
