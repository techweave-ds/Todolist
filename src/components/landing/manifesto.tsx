'use client'

import { motion } from 'framer-motion'

const principles = [
  {
    number: '01',
    title: 'Goals become campaigns',
    desc: 'Every ambition is a campaign. Break it into missions, assign XP, and watch your progress compound. No more forgotten objectives.',
  },
  {
    number: '02',
    title: 'Progress is visual',
    desc: 'Your workspace grows as you do. Each achievement adds a new object — a plant, a monitor, a trophy. Your environment reflects your journey.',
  },
  {
    number: '03',
    title: 'AI works for you',
    desc: 'Not a chatbot — a strategist. It reads your goals, plans your week, writes briefings, and coaches you when momentum dips.',
  },
  {
    number: '04',
    title: 'Data is your diary',
    desc: 'Analytics show you patterns. Focus time, completion rates, peak hours — the data reveals what your intuition misses.',
  },
]

const stats = [
  { value: '89%', label: 'Task completion rate' },
  { value: '2.4x', label: 'Focus time increase' },
  { value: '12K+', label: 'Missions completed' },
  { value: '4.8★', label: 'Average rating' },
]

export function Manifesto() {
  return (
    <section className="relative z-10 py-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built on <span className="text-gradient">four principles</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We designed Mission Control OS around how the most productive people actually work.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {principles.map((p, i) => (
            <motion.div
              key={p.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-8 hover:border-primary/20 transition-all duration-500"
            >
              <span className="text-5xl font-bold text-primary/10 absolute top-4 right-6 select-none group-hover:text-primary/20 transition-colors duration-500">
                {p.number}
              </span>
              <div className="relative z-10">
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((s, i) => (
            <div key={s.label} className="text-center p-6 rounded-xl border border-white/[0.04] bg-white/[0.02]">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                className="text-3xl md:text-4xl font-bold text-gradient block mb-1"
              >
                {s.value}
              </motion.span>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
