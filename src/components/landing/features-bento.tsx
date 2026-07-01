'use client'

import { motion } from 'framer-motion'
import { Target, Flag, Timer, Trophy, Medal, Brain, BarChart3, ScrollText, Layers, History } from 'lucide-react'
import { ReactNode } from 'react'

const features = [
  { icon: Target, title: 'Missions', desc: 'Tasks with priority, difficulty, deadlines, XP rewards, and subtasks. Filter by status, sort by urgency.', span: 'row-span-1 col-span-1' },
  { icon: Flag, title: 'Campaigns', desc: 'Group missions into campaigns. Track completion progress and total XP earned per campaign.', span: 'row-span-1 col-span-1' },
  { icon: Timer, title: 'Focus Sessions', desc: 'Pomodoro and deep-focus timers with ambient sound environments. Track your concentration streaks.', span: 'row-span-1 col-span-2' },
  { icon: Trophy, title: 'Achievements', desc: 'Unlock achievements for consistency — first mission, 100 missions, 30-day streaks, level milestones.', span: 'row-span-1 col-span-1' },
  { icon: Medal, title: 'XP & Leveling', desc: 'Earn XP per mission based on difficulty. Level up with animated progress bars and rank titles.', span: 'row-span-1 col-span-1' },
  { icon: Brain, title: 'AI Coach', desc: 'AI that breaks down goals, generates weekly plans, provides coaching, and writes daily briefings.', span: 'row-span-2 col-span-1' },
  { icon: Layers, title: 'Living Workspace', desc: 'A 3D workspace that evolves as you progress — new furniture, monitors, plants, and awards appear over time.', span: 'row-span-1 col-span-1' },
  { icon: History, title: 'Audio Environments', desc: 'Ambient sound profiles — focus, lo-fi, rain, space — controlled per-bus with crossfade transitions.', span: 'row-span-1 col-span-1' },
  { icon: BarChart3, title: 'Analytics', desc: 'Track completion rates, focus time trends, category distribution, and peak productivity hours.', span: 'row-span-1 col-span-1' },
  { icon: ScrollText, title: 'Memory Lane', desc: 'A growing timeline of your milestones — achievements, streaks, campaigns completed, and major wins.', span: 'row-span-1 col-span-1' },
]

function BentoCard({ icon: Icon, title, desc, span, index }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string; span: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`${span} group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6 cursor-default overflow-hidden transition-all duration-300 hover:border-primary/30 hover:bg-white/[0.06] hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-accent/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  )
}

export function FeaturesBento() {
  return (
    <section className="relative z-10 py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything{' '}
            <span className="text-gradient">in one console</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Ten integrated tools. One dashboard. Zero configuration needed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[180px]">
          {features.map((f, i) => (
            <BentoCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
