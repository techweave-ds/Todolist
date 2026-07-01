'use client'

import { useState, useEffect, useCallback } from 'react'
import { useMissionStore } from '@/store/mission-store'
import { useCampaignStore } from '@/store/campaign-store'
import { useAppStore } from '@/store/app-store'
import { Plus, MoreHorizontal, Calendar, Clock, Sparkles, Target, SortAsc, Tag, Folder, ListChecks } from 'lucide-react'
import { formatRelativeDate } from '@/lib/utils'
import { GoalBreakdown } from '@/components/ai/goal-breakdown'
import { EmptyState } from '@/components/ui/empty-state'
import { XpDisplay } from '@/components/glass/xp-display'
import { SubtaskList } from '@/components/missions/subtask-list'

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

const reminderOptions = [
  { value: '', label: 'No reminder' },
  { value: '5', label: '5 min before' },
  { value: '15', label: '15 min before' },
  { value: '30', label: '30 min before' },
  { value: '60', label: '1 hour before' },
  { value: '1440', label: '1 day before' },
]

type SortKey = 'deadline' | 'priority' | 'createdAt'

export default function MissionsPage() {
  const { missions, isLoading, error, fetchMissions, createMission, completeMission, deleteMission, updateMission } = useMissionStore()
  const { campaigns, fetchCampaigns } = useCampaignStore()
  const { userId } = useAppStore()
  const [showCreate, setShowCreate] = useState(false)
  const [showGoalBreakdown, setShowGoalBreakdown] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [sortKey, setSortKey] = useState<SortKey>('deadline')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<string>('medium')
  const [difficulty, setDifficulty] = useState<string>('medium')
  const [deadlineDate, setDeadlineDate] = useState('')
  const [deadlineTime, setDeadlineTime] = useState('')
  const [remindBefore, setRemindBefore] = useState('')
  const [estimatedTime, setEstimatedTime] = useState('')
  const [campaignId, setCampaignId] = useState('')
  const [tags, setTags] = useState('')
  const [category, setCategory] = useState('')
  const [completedXP, setCompletedXP] = useState<{ missionId: string; amount: number } | null>(null)
  const [creating, setCreating] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const triggerRefresh = useCallback(() => setRefreshKey(k => k + 1), [])

  const handleComplete = useCallback(async (mission: any) => {
    if (!userId || mission.status === 'completed') return
    const result = await completeMission(mission.id, userId)
    if (result) {
      setCompletedXP({ missionId: mission.id, amount: result.xpReward })
      setTimeout(() => setCompletedXP(null), 2000)
    }
  }, [userId, completeMission])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('create') === 'true') {
      setShowCreate(true)
    }
  }, [])

  useEffect(() => {
    if (userId) {
      fetchMissions(userId)
      fetchCampaigns(userId)
    }
  }, [userId, fetchMissions, fetchCampaigns])

  const filteredMissions = missions.filter(m => {
    if (filter === 'all') return true
    if (filter === 'pending') return m.status === 'pending'
    if (filter === 'active') return m.status === 'active'
    if (filter === 'completed') return m.status === 'completed'
    return true
  })

  const sortedMissions = [...filteredMissions].sort((a, b) => {
    if (sortKey === 'deadline') {
      if (!a.deadline && !b.deadline) return 0
      if (!a.deadline) return 1
      if (!b.deadline) return -1
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    }
    if (sortKey === 'priority') {
      const pOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }
      return (pOrder[a.priority] ?? 2) - (pOrder[b.priority] ?? 2)
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || creating) return
    setCreating(true)

    let deadline: string | undefined
    if (deadlineDate) {
      deadline = deadlineTime ? `${deadlineDate}T${deadlineTime}:00` : `${deadlineDate}T23:59:00`
    }

    const tagList = tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    const result = await createMission({
      title,
      description: description || undefined,
      priority: priority as any,
      difficulty: difficulty as any,
      deadline,
      estimatedTime: estimatedTime ? parseInt(estimatedTime) : undefined,
      campaignId: campaignId || undefined,
      category: category || undefined,
      tags: tagList,
      remindBefore: remindBefore ? parseInt(remindBefore) : undefined,
    }, userId)

    if (result) {
      setTitle('')
      setDescription('')
      setDeadlineDate('')
      setDeadlineTime('')
      setRemindBefore('')
      setEstimatedTime('')
      setCampaignId('')
      setTags('')
      setCategory('')
      setShowCreate(false)
    }
    setCreating(false)
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
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
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <SortAsc className="w-3 h-3" />
            <select
              value={sortKey}
              onChange={e => setSortKey(e.target.value as SortKey)}
              className="bg-transparent outline-none text-xs cursor-pointer"
            >
              <option value="deadline">By Deadline</option>
              <option value="priority">By Priority</option>
              <option value="createdAt">Newest</option>
            </select>
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

      {error && (
        <div className="glass rounded-xl p-3 text-sm text-red-400 border border-red-500/20">
          {error}
        </div>
      )}

      {showCreate && (
        <form onSubmit={handleCreate} className="glass rounded-xl p-4 animate-slide-down space-y-3">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Mission title..."
            className="w-full px-3 py-2 rounded-lg bg-muted/50 border outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            autoFocus
            required
          />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full px-3 py-2 rounded-lg bg-muted/50 border outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none h-20"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Due Date</label>
              <input
                type="date"
                value={deadlineDate}
                onChange={e => setDeadlineDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-muted/50 border outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Time</label>
              <input
                type="time"
                value={deadlineTime}
                onChange={e => setDeadlineTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-muted/50 border outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Remind Me</label>
              <select
                value={remindBefore}
                onChange={e => setRemindBefore(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-muted/50 border outline-none text-sm"
                disabled={!deadlineDate}
              >
                {reminderOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Est. Time</label>
              <input
                type="number"
                min="1"
                value={estimatedTime}
                onChange={e => setEstimatedTime(e.target.value)}
                placeholder="Minutes"
                className="w-full px-3 py-2 rounded-lg bg-muted/50 border outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-muted/50 border outline-none text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Difficulty</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-muted/50 border outline-none text-sm"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="legendary">Legendary</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Campaign</label>
              <select
                value={campaignId}
                onChange={e => setCampaignId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-muted/50 border outline-none text-sm"
              >
                <option value="">None</option>
                {campaigns.filter(c => c.status === 'active').map(c => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.title}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Category</label>
              <input
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="e.g. Work, Personal"
                className="w-full px-3 py-2 rounded-lg bg-muted/50 border outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Tags (comma-separated)</label>
            <input
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="e.g. urgent, frontend, design"
              className="w-full px-3 py-2 rounded-lg bg-muted/50 border outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={creating || !title.trim()}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 transition-opacity"
            >
              {creating ? 'Deploying...' : 'Deploy Mission'}
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              disabled={creating}
              className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
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
        ) : sortedMissions.length === 0 ? (
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
          sortedMissions.map((mission) => (
            <div key={mission.id} className="glass rounded-xl p-4 mission-card relative">
              <XpDisplay
                amount={completedXP?.missionId === mission.id ? completedXP.amount : 0}
                show={completedXP?.missionId === mission.id}
                className="absolute inset-0 flex items-center justify-center z-10"
              />
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleComplete(mission)}
                  disabled={mission.status === 'completed'}
                  className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                    mission.status === 'completed'
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground hover:border-primary'
                  }`}
                >
                  {mission.status === 'completed' && <span className="text-[10px]">✓</span>}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-medium ${mission.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                      {mission.title}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${priorityColors[mission.priority] || 'bg-gray-500'} ${mission.priority === 'critical' ? 'animate-pulse-glow' : ''}`} />
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{difficultyLabels[mission.difficulty] || mission.difficulty}</span>
                    {mission.category && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary/70 flex items-center gap-1">
                        <Folder className="w-2.5 h-2.5" />
                        {mission.category}
                      </span>
                    )}
                  </div>
                  {mission.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{mission.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
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
                    {mission.tags && mission.tags.length > 0 && (
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                        <Tag className="w-3 h-3" />
                        {mission.tags.slice(0, 3).join(', ')}
                        {mission.tags.length > 3 && ` +${mission.tags.length - 3}`}
                      </span>
                    )}
                    {mission.campaign && (
                      <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
                        <ListChecks className="w-3 h-3" />
                        {mission.campaign.title}
                      </span>
                    )}
                    <span className="text-[10px] text-primary font-medium">+{mission.xpReward} XP</span>
                  </div>

                  <SubtaskList
                    missionId={mission.id}
                    subtasks={mission.subtasks}
                    onUpdate={() => userId && fetchMissions(userId)}
                  />
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
