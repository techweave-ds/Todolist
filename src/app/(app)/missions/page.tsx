'use client'

import { useState, useEffect } from 'react'
import { useMissionStore } from '@/store/mission-store'
import { useAppStore } from '@/store/app-store'
import { Plus, MoreHorizontal, Calendar, Clock, Sparkles, Target } from 'lucide-react'
import { formatRelativeDate } from '@/lib/utils'
import { GoalBreakdown } from '@/components/ai/goal-breakdown'
import { EmptyState } from '@/components/ui/empty-state'

const priorityColors: Record<string, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
}

const difficultyLabels: Record<string, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  legendary: 'Legendary',
}

export default function MissionsPage() {
  const { missions, isLoading, fetchMissions, createMission, completeMission, deleteMission } = useMissionStore()
  const { userId } = useAppStore()
  const [showCreate, setShowCreate] = useState(false)
  const [showGoalBreakdown, setShowGoalBreakdown] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<string>('medium')
  const [difficulty, setDifficulty] = useState<string>('medium')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('create') === 'true') {
      setShowCreate(true)
    }
  }, [])

  useEffect(() => {
    if (userId) fetchMissions(userId)
  }, [userId, fetchMissions])

  const filteredMissions = missions.filter(m => {
    if (filter === 'all') return true
    if (filter === 'pending') return m.status === 'pending'
    if (filter === 'active') return m.status === 'active'
    if (filter === 'completed') return m.status === 'completed'
    return true
  })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    await createMission({ title, description, priority: priority as any, difficulty: difficulty as any }, userId)
    setTitle('')
    setDescription('')
    setShowCreate(false)
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Missions</h1>
          <p className="text-sm text-muted-foreground">Manage your tasks</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 glass rounded-lg p-1">
            {['all', 'pending', 'active', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  filter === f ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowGoalBreakdown(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Generate with AI
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            New Mission
          </button>
        </div>
      </div>

      <GoalBreakdown open={showGoalBreakdown} onClose={() => setShowGoalBreakdown(false)} />

      {showCreate && (
        <form onSubmit={handleCreate} className="glass rounded-xl p-4 animate-slide-up">
          <div className="space-y-3">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Mission title..."
              className="w-full px-3 py-2 rounded-lg bg-muted/50 border outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              autoFocus
            />
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full px-3 py-2 rounded-lg bg-muted/50 border outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none h-20"
            />
            <div className="flex gap-3">
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="px-3 py-2 rounded-lg bg-muted/50 border outline-none text-sm"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="critical">Critical</option>
              </select>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
                className="px-3 py-2 rounded-lg bg-muted/50 border outline-none text-sm"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="legendary">Legendary</option>
              </select>
              <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                Create
              </button>
              <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground">
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass rounded-xl p-4">
                <div className="h-4 bg-muted rounded w-48 animate-pulse" />
                <div className="h-3 bg-muted rounded w-72 mt-2 animate-pulse" />
              </div>
            ))}
          </div>
        ) : filteredMissions.length === 0 ? (
          filter === 'all' ? (
            <EmptyState
              icon={<Target className="w-12 h-12" />}
              title="No missions deployed"
              description="Your mission queue is empty. Intelligence reports no active objectives. Deploy your first mission to begin your campaign."
              action={
                <button
                  onClick={() => setShowCreate(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  Deploy Mission
                </button>
              }
            />
          ) : (
            <EmptyState
              icon={<Target className="w-12 h-12" />}
              title={`No ${filter} missions`}
              description={`You don't have any ${filter} missions right now. Try a different filter or create a new mission.`}
            />
          )
        ) : (
          filteredMissions.map((mission) => (
            <div key={mission.id} className="glass rounded-xl p-4 mission-card">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => userId && completeMission(mission.id, userId)}
                  className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                    mission.status === 'completed'
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground hover:border-primary'
                  }`}
                >
                  {mission.status === 'completed' && <span className="text-[10px]">✓</span>}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${mission.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                      {mission.title}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${priorityColors[mission.priority] || 'bg-gray-500'} ${mission.priority === 'critical' ? 'animate-pulse-glow' : ''}`} />
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{difficultyLabels[mission.difficulty] || mission.difficulty}</span>
                  </div>
                  {mission.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{mission.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    {mission.deadline && (
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatRelativeDate(mission.deadline)}
                      </span>
                    )}
                    {mission.estimatedTime && (
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {mission.estimatedTime}m
                      </span>
                    )}
                    <span className="text-[10px] text-primary font-medium">+{mission.xpReward} XP</span>
                  </div>
                </div>
                <button onClick={() => userId && deleteMission(mission.id, userId)} className="p-1 rounded hover:bg-muted/50 transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
