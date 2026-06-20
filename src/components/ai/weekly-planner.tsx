'use client'

import { useAIStore } from '@/store/ai-store'
import { useAppStore } from '@/store/app-store'
import { Calendar, Loader2, RefreshCw, Target, Flag, Sparkles } from 'lucide-react'

export function WeeklyPlanner() {
  const { userId } = useAppStore()
  const { weeklyPlan, weeklyPlanLoading, generateWeeklyPlan } = useAIStore()

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Weekly Plan</span>
        </div>
        <button
          onClick={() => userId && generateWeeklyPlan(userId)}
          disabled={weeklyPlanLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
        >
          {weeklyPlanLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
          {weeklyPlanLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {weeklyPlanLoading ? (
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
          <div className="h-3 bg-muted rounded animate-pulse w-full" />
          <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
        </div>
      ) : weeklyPlan ? (
        <div className="space-y-4">
          {weeklyPlan.weeklyGoals?.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Weekly Goals
              </h4>
              <div className="space-y-1.5">
                {weeklyPlan.weeklyGoals.map((g: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{g}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {weeklyPlan.missions?.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                <Target className="w-3 h-3" /> Suggested Missions
              </h4>
              <div className="space-y-1.5">
                {weeklyPlan.missions.map((m: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">{m.difficulty}</span>
                    <span>{m.title}</span>
                    {m.campaignTitle && <span className="text-xs text-muted-foreground">— {m.campaignTitle}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {weeklyPlan.campaigns?.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                <Flag className="w-3 h-3" /> Suggested Campaigns
              </h4>
              <div className="space-y-2">
                {weeklyPlan.campaigns.map((c: any, i: number) => (
                  <div key={i} className="glass rounded-lg px-3 py-2">
                    <p className="text-sm font-medium">{c.title}</p>
                    {c.description && <p className="text-xs text-muted-foreground mt-0.5">{c.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-6">
          Generate a weekly plan based on your current missions and campaigns.
        </p>
      )}
    </div>
  )
}
