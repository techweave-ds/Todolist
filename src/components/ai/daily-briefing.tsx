'use client'

import { useEffect } from 'react'
import { useAIStore } from '@/store/ai-store'
import { useAppStore } from '@/store/app-store'
import { Sparkles, RefreshCw, Loader2 } from 'lucide-react'

export function DailyBriefing() {
  const { userId } = useAppStore()
  const { briefing, briefingLoading, fetchBriefing } = useAIStore()

  useEffect(() => {
    if (!userId) return
    if (!briefing && !briefingLoading) fetchBriefing(userId)
  }, [userId, briefing, briefingLoading, fetchBriefing])

  return (
    <div className="glass rounded-xl p-4 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Daily Briefing</span>
        </div>
        <button
          onClick={() => userId && fetchBriefing(userId)}
          disabled={briefingLoading}
          className="p-1 rounded-md hover:bg-muted/50 transition-colors"
        >
          {briefingLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
        </button>
      </div>
      {briefingLoading && !briefing ? (
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded animate-pulse w-full" />
          <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
        </div>
      ) : briefing ? (
        <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
          {briefing}
        </div>
      ) : null}
    </div>
  )
}
