'use client'

import { useAchievementStore } from '@/store/achievement-store'
import { useAppStore } from '@/store/app-store'
import { useEffect } from 'react'
import { ACHIEVEMENTS } from '@/core/constants'
import { Lock, Unlock } from 'lucide-react'

const rarityColors: Record<string, string> = {
  common: 'from-gray-400 to-gray-300',
  rare: 'from-blue-500 to-purple-500',
  epic: 'from-purple-500 to-pink-500',
  legendary: 'from-yellow-400 to-orange-500',
}

const rarityBg: Record<string, string> = {
  common: 'bg-gray-500/10 border-gray-500/20',
  rare: 'bg-blue-500/10 border-blue-500/20',
  epic: 'bg-purple-500/10 border-purple-500/20',
  legendary: 'bg-yellow-500/10 border-yellow-500/20',
}

export default function AchievementsPage() {
  const { achievements, fetchAchievements } = useAchievementStore()
  const { userId } = useAppStore()

  useEffect(() => {
    if (userId) fetchAchievements(userId)
  }, [userId, fetchAchievements])

  const allDefinitions = Object.values(ACHIEVEMENTS)

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold">Achievements</h1>
        <p className="text-sm text-muted-foreground">Track your progress and unlock badges</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allDefinitions.map((def) => {
          const userAchievement = achievements.find(a => a.achievement?.key === def.key)
          const unlocked = !!userAchievement?.unlockedAt
          const progress = userAchievement?.progress || 0

          return (
            <div
              key={def.key}
              className={`glass rounded-xl p-4 border transition-all ${unlocked ? rarityBg[def.rarity] : 'opacity-60'}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${rarityColors[def.rarity]} flex items-center justify-center text-2xl`}>
                  {def.emoji}
                </div>
                {unlocked ? (
                  <Unlock className="w-4 h-4 text-green-500" />
                ) : (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <h3 className="font-medium text-sm">{def.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{def.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  String(def.rarity) === 'legendary' ? 'bg-yellow-500/20 text-yellow-500' :
                  def.rarity === 'epic' ? 'bg-purple-500/20 text-purple-500' :
                  def.rarity === 'rare' ? 'bg-blue-500/20 text-blue-500' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {def.rarity}
                </span>
                <span className="text-xs text-primary font-medium">+{def.xpReward} XP</span>
              </div>
              {!unlocked && (
                <div className="mt-3">
                  <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1">{Math.round(progress)}% complete</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
