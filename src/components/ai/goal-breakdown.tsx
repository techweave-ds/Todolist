'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAIStore } from '@/store/ai-store'
import { useMissionStore } from '@/store/mission-store'
import { useAppStore } from '@/store/app-store'
import { Target, Loader2, X, Check, ChevronRight, Sparkles } from 'lucide-react'

type Props = {
  open: boolean
  onClose: () => void
}

export function GoalBreakdown({ open, onClose }: Props) {
  const { userId } = useAppStore()
  const { breakDownGoal, goalResult, goalLoading, clearCoach } = useAIStore()
  const { createMission } = useMissionStore()
  const [goal, setGoal] = useState('')
  const [creating, setCreating] = useState<string | null>(null)

  const handleBreakdown = async () => {
    if (!goal.trim()) return
    if (!userId) return
    await breakDownGoal(goal.trim(), userId)
  }

  const handleCreateMission = async (m: { title: string; description?: string; difficulty: string }) => {
    setCreating(m.title)
    await createMission({
      title: m.title,
      description: m.description,
      difficulty: m.difficulty.toLowerCase() as any,
    }, userId!)
    setCreating(null)
  }

  const handleCreateAll = async () => {
    if (!goalResult?.missions) return
    for (const m of goalResult.missions) {
      await createMission({
        title: m.title,
        description: m.description,
        difficulty: m.difficulty.toLowerCase() as any,
      }, userId!)
    }
    clearCoach()
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-lg glass-strong rounded-2xl shadow-2xl p-6"
          >
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-md hover:bg-muted/50">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Break Down a Goal</h2>
            <p className="text-xs text-muted-foreground">AI will generate actionable missions</p>
          </div>
        </div>

        {!goalResult && (
          <div className="space-y-3">
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Describe your goal... (e.g., Launch a personal blog)"
              className="w-full h-24 px-4 py-3 rounded-xl bg-muted/50 border outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
            />
            <button
              onClick={handleBreakdown}
              disabled={goalLoading || !goal.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {goalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {goalLoading ? 'Thinking...' : 'Break Down Goal'}
            </button>
          </div>
        )}

        {goalResult && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">
                Est. {goalResult.estimatedTime} min • {goalResult.missions.length} missions
              </span>
              <button
                onClick={handleCreateAll}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90"
              >
                <Check className="w-3 h-3" />
                Create All
              </button>
            </div>

            {goalResult.summary && (
              <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">{goalResult.summary}</p>
            )}

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {(goalResult.missions as any[]).map((m: any, i) => {
                const diffColor = m.difficulty === 'LEGENDARY' ? 'text-red-500' : m.difficulty === 'HARD' ? 'text-orange-500' : m.difficulty === 'MEDIUM' ? 'text-yellow-500' : 'text-green-500'
                return (
                  <div key={i} className="glass rounded-xl p-3 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${diffColor} bg-muted/50`}>{m.difficulty}</span>
                        <span className="text-sm font-medium truncate">{m.title}</span>
                      </div>
                      {m.description && <p className="text-xs text-muted-foreground mt-1 truncate">{m.description}</p>}
                    </div>
                    <button
                      onClick={() => handleCreateMission(m)}
                      disabled={creating === m.title}
                      className="shrink-0 p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      {creating === m.title ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
