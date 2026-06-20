'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import { useMissionStore } from '@/store/mission-store'
import { useXPStore } from '@/store/xp-store'
import { useAIStore } from '@/store/ai-store'
import { Target, Brain, Trophy, Zap, Calendar, Sparkles, MessageSquare } from 'lucide-react'
import { formatRelativeDate } from '@/lib/utils'
import { DailyBriefing } from '@/components/ai/daily-briefing'
import { WeeklyPlanner } from '@/components/ai/weekly-planner'
import { AICoach } from '@/components/ai/ai-coach'
import { GoalBreakdown } from '@/components/ai/goal-breakdown'
import { MissionHero } from '@/components/dashboard/mission-hero'
import { CommanderProfile } from '@/components/dashboard/commander-profile'
import { EmptyState } from '@/components/ui/empty-state'

const stagger = {
  animate: {
    transition: { staggerChildren: 0.08 },
  },
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

const quickActions = [
  { label: 'New Mission', href: '/missions?create=true', icon: Target, gradient: 'from-blue-500 to-purple-500' },
  { label: 'Start Focus', href: '/focus', icon: Brain, gradient: 'from-green-500 to-teal-500' },
  { label: 'View Campaigns', href: '/campaigns', icon: Calendar, gradient: 'from-orange-500 to-red-500' },
  { label: 'Achievements', href: '/achievements', icon: Trophy, gradient: 'from-yellow-500 to-pink-500' },
]

export default function DashboardPage() {
  const { dashboardStats, fetchDashboardStats, userId, isLoading: statsLoading } = useAppStore()
  const { missions, fetchMissions } = useMissionStore()
  const { level, currentXP, xpToNextLevel, progress, fetchLevelInfo } = useXPStore()
  const { getMotivation, motivation } = useAIStore()
  const [coachOpen, setCoachOpen] = useState(false)
  const [goalOpen, setGoalOpen] = useState(false)

  useEffect(() => {
    if (!userId) return
    fetchDashboardStats(userId)
    fetchMissions(userId)
    fetchLevelInfo(userId)
    getMotivation(userId)
  }, [userId, fetchDashboardStats, fetchMissions, fetchLevelInfo, getMotivation])

  const stats = dashboardStats
  const activeMissions = missions.filter(m => m.status === 'pending' || m.status === 'active')

  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <MissionHero />

      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => setGoalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Break Down Goal
        </button>
        <button
          onClick={() => setCoachOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass text-xs font-medium hover:bg-muted/50 transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          AI Coach
        </button>
      </div>

      {motivation && (
        <motion.div variants={fadeUp} className="glass rounded-xl p-4 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/10">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm italic text-muted-foreground leading-relaxed">&ldquo;{motivation}&rdquo;</p>
          </div>
        </motion.div>
      )}

      <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <a
              key={action.label}
              href={action.href}
              className="group relative glass rounded-xl p-4 hover:scale-[1.02] transition-all cursor-pointer overflow-hidden"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium">{action.label}</p>
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          )
        })}
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statsLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass rounded-xl p-4">
                <div className="h-3 bg-muted rounded w-20 animate-pulse mb-2" />
                <div className="h-7 bg-muted rounded w-12 animate-pulse" />
              </div>
            ))
          : (
            <>
              <div className="glass rounded-xl p-4 group hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Today&apos;s Missions</span>
                </div>
                <p className="text-2xl font-bold tabular-nums">{stats?.todayMissions || 0}</p>
                <div className="mt-1 h-0.5 w-0 group-hover:w-full bg-primary/30 transition-all duration-500 rounded-full" />
              </div>
              <div className="glass rounded-xl p-4 group hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-muted-foreground">Streak</span>
                </div>
                <p className="text-2xl font-bold tabular-nums">{stats?.dailyStreak || 0}d</p>
                <div className="mt-1 h-0.5 w-0 group-hover:w-full bg-amber-400/30 transition-all duration-500 rounded-full" />
              </div>
              <div className="glass rounded-xl p-4 group hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-muted-foreground">Focus Score</span>
                </div>
                <p className="text-2xl font-bold tabular-nums">{stats?.focusScore || 0}</p>
                <div className="mt-1 h-0.5 w-0 group-hover:w-full bg-emerald-400/30 transition-all duration-500 rounded-full" />
              </div>
              <div className="glass rounded-xl p-4 group hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-4 h-4 text-primary/60" />
                  <span className="text-xs text-muted-foreground">Achievements</span>
                </div>
                <p className="text-2xl font-bold tabular-nums">{stats?.recentAchievements?.length || 0}</p>
                <div className="mt-1 h-0.5 w-0 group-hover:w-full bg-primary/30 transition-all duration-500 rounded-full" />
              </div>
            </>
          )}
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-6">
          <DailyBriefing />

          <div className="glass rounded-xl p-4">
            <h2 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-primary" />
              Active Missions
              <span className="text-xs text-muted-foreground font-normal">({activeMissions.length})</span>
            </h2>

            {activeMissions.length > 0 ? (
              <div className="space-y-1">
                {activeMissions.slice(0, 5).map((mission) => (
                  <div key={mission.id} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-muted/30 transition-colors group cursor-pointer">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${
                      mission.priority === 'critical' ? 'bg-red-500 animate-pulse-glow' :
                      mission.priority === 'high' ? 'bg-orange-500' :
                      mission.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                    }`} />
                    <span className="text-sm flex-1 truncate group-hover:text-foreground transition-colors">{mission.title}</span>
                    {mission.deadline && (
                      <span className="text-xs text-muted-foreground shrink-0">{formatRelativeDate(mission.deadline)}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">No active missions. Deploy your first mission from the Missions tab.</p>
              </div>
            )}
          </div>

          <div className="glass rounded-xl p-4">
            <h2 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              Campaign Progress
            </h2>

            {stats?.campaignProgress?.length > 0 ? (
              <div className="space-y-3">
                {stats.campaignProgress.map((camp: any) => (
                  <div key={camp.id} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm">{camp.emoji} {camp.title}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">{camp.completed}/{camp.total}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700 group-hover:opacity-80" style={{ width: `${camp.completed / Math.max(camp.total, 1) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">No campaigns yet. Start a campaign to track progress across multiple missions.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <CommanderProfile />

          <div className="glass rounded-xl p-4">
            <h2 className="text-sm font-medium mb-3">Recent Achievements</h2>
            {stats?.recentAchievements?.length > 0 ? (
              <div className="space-y-2">
                {stats.recentAchievements.slice(0, 5).map((a: any) => (
                  <div key={a.key} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <span className="text-lg">{a.emoji}</span>
                    <span className="text-xs truncate">{a.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Complete missions to earn achievements and climb the ranks.</p>
              </div>
            )}
          </div>

          <WeeklyPlanner />
        </div>
      </motion.div>

      <AICoach open={coachOpen} onClose={() => setCoachOpen(false)} />
      <GoalBreakdown open={goalOpen} onClose={() => setGoalOpen(false)} />
    </motion.div>
  )
}
