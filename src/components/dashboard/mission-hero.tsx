'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import { Sparkles, Zap, Shield, Brain, Activity } from 'lucide-react'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function getReadinessScore(stats: any) {
  let score = 0
  if (stats?.activeMissions > 0) score += 25
  if (stats?.focusSessions > 0) score += 20
  if (stats?.completedToday > 0) score += 25
  if (stats?.recentXP > 50) score += 15
  if (stats?.streakDays > 0) score += 15
  return Math.min(100, score)
}

function getReadinessLabel(score: number) {
  if (score >= 80) return 'Optimal'
  if (score >= 60) return 'Ready'
  if (score >= 40) return 'Warming Up'
  return 'Needs Activation'
}

function getReadinessColor(score: number) {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 60) return 'text-primary'
  if (score >= 40) return 'text-amber-400'
  return 'text-muted-foreground'
}

export function MissionHero() {
  const { dashboardStats, isLoading } = useAppStore()

  const stats = dashboardStats
  const readinessScore = useMemo(() => getReadinessScore(stats), [stats])
  const readinessLabel = getReadinessLabel(readinessScore)
  const readinessColor = getReadinessColor(readinessScore)

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="h-8 bg-muted rounded w-72 animate-pulse mb-2" />
        <div className="h-5 bg-muted rounded w-96 animate-pulse" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">
            {getGreeting()}, Commander
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
            Your command center is online. All systems nominal — ready to track missions,
            monitor progress, and execute your objectives.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl glass"
        >
          <Activity className="w-5 h-5 text-primary/60" />
          <div className="text-right">
            <div className={`text-lg font-bold tracking-tight ${readinessColor}`}>
              {readinessScore}%
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {readinessLabel}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary/40" />
          {stats?.activeMissions ?? 0} active missions
        </span>
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-accent/40" />
          {stats?.focusSessions ?? 0} focus sessions
        </span>
        <span className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-400/40" />
          <span>
            {stats?.streakDays ?? 0}-day streak
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <Brain className="w-3.5 h-3.5 text-purple-400/40" />
          {stats?.completedToday ?? 0} completed today
        </span>
      </div>
    </motion.div>
  )
}
