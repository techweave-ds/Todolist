'use client'

import { useEffect, useState } from 'react'
import { WorkspaceCanvas } from '@/components/workspace/workspace-canvas'
import { useAppStore } from '@/store/app-store'
import { Sparkles, Zap, Palette, Unlock, RotateCcw } from 'lucide-react'

export default function WorkspacePage() {
  const { dashboardStats, fetchDashboardStats, userId } = useAppStore()
  const [theme, setTheme] = useState('neon-dreams')

  useEffect(() => {
    if (!userId) return
    fetchDashboardStats(userId)
  }, [userId, fetchDashboardStats])

  const level = dashboardStats?.level || 1
  const totalXP = dashboardStats?.totalXP || 0

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Workspace</h1>
          <p className="text-sm text-muted-foreground">Your 3D command center — Level {level}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{totalXP.toLocaleString()} XP</span>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/50">
            <Zap className="w-3 h-3 text-yellow-500" />
            <span className="text-xs font-medium">Lv.{level}</span>
          </div>
        </div>
      </div>

      <div className="h-[400px] glass rounded-2xl overflow-hidden">
        <WorkspaceCanvas level={level} theme={theme} />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Palette className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Theme</span>
          </div>
          <div className="flex gap-1 mt-2">
            {['neon-dreams', 'deep-space', 'aurora', 'cyber'].map(t => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`w-6 h-6 rounded-full transition-all ${theme === t ? 'ring-2 ring-primary scale-110' : ''}`}
                style={{
                  background: t === 'neon-dreams' ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' :
                              t === 'deep-space' ? 'linear-gradient(135deg, #3730A3, #1E40AF)' :
                              t === 'aurora' ? 'linear-gradient(135deg, #10B981, #3B82F6)' :
                              'linear-gradient(135deg, #EC4899, #F59E0B)'
                }}
              />
            ))}
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-muted-foreground">Upgrades</span>
          </div>
          <p className="text-2xl font-bold">{Math.floor(level / 3)}</p>
          <p className="text-[10px] text-muted-foreground">unlocked</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Unlock className="w-4 h-4 text-green-500" />
            <span className="text-xs text-muted-foreground">Next at Lv.{level + 1}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {level < 5 ? 'Advanced Analytics' :
             level < 8 ? 'AI Coach' :
             level < 10 ? 'Memory Lane' :
             level < 15 ? 'Premium Themes' :
             level < 20 ? 'Custom Audio' : 'All unlocked'}
          </p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <RotateCcw className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-muted-foreground">Rotate</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Drag to orbit • Scroll to zoom</p>
        </div>
      </div>
    </div>
  )
}
