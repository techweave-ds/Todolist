'use client'

import { useEffect } from 'react'
import { useMemoryLaneStore } from '@/store/memory-lane-store'
import { useAppStore } from '@/store/app-store'
import { History, Award, Flag, Star, Zap } from 'lucide-react'

const typeIcons: Record<string, any> = {
  achievement: Award,
  milestone: Star,
  campaign_complete: Flag,
  streak_record: Zap,
  major_win: Award,
}

const typeColors: Record<string, string> = {
  achievement: 'from-yellow-500 to-orange-500',
  milestone: 'from-blue-500 to-purple-500',
  campaign_complete: 'from-green-500 to-teal-500',
  streak_record: 'from-red-500 to-pink-500',
  major_win: 'from-purple-500 to-pink-500',
}

export default function MemoryLanePage() {
  const { userId } = useAppStore()
  const { entries, timeline, fetchMemoryLane } = useMemoryLaneStore()

  useEffect(() => {
    if (userId) fetchMemoryLane(userId)
  }, [userId, fetchMemoryLane])

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold">Memory Lane</h1>
        <p className="text-sm text-muted-foreground">Your journey through time</p>
      </div>

      {timeline.length === 0 ? (
        <div className="text-center py-12 glass rounded-xl">
          <History className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">Your memory lane is empty</p>
          <p className="text-xs text-muted-foreground mt-1">Complete missions and earn achievements to fill it</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-6">
            {timeline.map((day: any) => (
              <div key={day.date} className="relative pl-14">
                <div className="absolute left-4 top-1 w-5 h-5 rounded-full bg-primary border-2 border-background flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-2">
                    {new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  <div className="space-y-2">
                    {day.items.map((entry: any) => {
                      const Icon = typeIcons[entry.type] || History
                      const colors = typeColors[entry.type] || 'from-gray-500 to-gray-400'
                      return (
                        <div key={entry.id} className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors} flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{entry.title}</p>
                            {entry.description && (
                              <p className="text-xs text-muted-foreground">{entry.description}</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {entries.length > 0 && (
        <div className="glass rounded-xl p-4">
          <h2 className="text-sm font-medium mb-3">All Memories</h2>
          <div className="grid grid-cols-2 gap-3">
            {entries.map((entry: any) => {
              const Icon = typeIcons[entry.type] || History
              const colors = typeColors[entry.type] || 'from-gray-500 to-gray-400'
              return (
                <div key={entry.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{entry.title}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
