'use client'

import { motion } from 'framer-motion'
import { Trophy, Star, TrendingUp } from 'lucide-react'
import { useXPStore } from '@/store/xp-store'
import { cn } from '@/lib/utils'

const RANKS = [
  { level: 1, title: 'Cadet', icon: '○' },
  { level: 5, title: 'Operator', icon: '◇' },
  { level: 10, title: 'Tactician', icon: '□' },
  { level: 20, title: 'Strategist', icon: '△' },
  { level: 35, title: 'Commander', icon: '☆' },
  { level: 50, title: 'Elite', icon: '★' },
  { level: 75, title: 'Legend', icon: '♦' },
  { level: 100, title: 'Icon', icon: '♛' },
]

function getRank(level: number) {
  let rank = RANKS[0]
  for (const r of RANKS) {
    if (level >= r.level) rank = r
  }
  return rank
}

export function CommanderProfile() {
  const { totalXP, level, currentXP, xpToNextLevel, progress } = useXPStore()
  const rank = getRank(level)
  const nextRank = RANKS.find(r => r.level > level)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass rounded-xl p-5 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl">
            <span className="drop-shadow-glow">{rank.icon}</span>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Commander Rank</div>
            <div className="text-sm font-semibold flex items-center gap-2">
              {rank.title}
              <span className="text-xs text-muted-foreground font-normal">Lv.{level}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Trophy className="w-3 h-3 text-primary/60" />
              {totalXP.toLocaleString()} Total XP
            </span>
            {nextRank && (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-accent/60" />
                Next: {nextRank.title}
              </span>
            )}
          </div>

          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-accent"
            />
          </div>

          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{currentXP.toLocaleString()} XP</span>
            <span>{xpToNextLevel.toLocaleString()} XP to next level</span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-primary/60 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>Progress: {progress}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
