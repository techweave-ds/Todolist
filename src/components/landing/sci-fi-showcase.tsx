'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Monitor, Cpu, CircuitBoard, Database, Globe } from 'lucide-react'

const nodes = [
  { icon: Monitor, label: 'Workspace', x: '50%', y: '20%' },
  { icon: Cpu, label: 'AI Core', x: '20%', y: '45%' },
  { icon: Database, label: 'Memory Bank', x: '80%', y: '45%' },
  { icon: CircuitBoard, label: 'Mission Grid', x: '35%', y: '70%' },
  { icon: Globe, label: 'Network', x: '65%', y: '70%' },
]

function ConnectionLines() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'blur(1px)' }}>
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(168,85,247,0.3)" />
          <stop offset="50%" stopColor="rgba(99,102,241,0.5)" />
          <stop offset="100%" stopColor="rgba(168,85,247,0.3)" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {nodes.map((a, i) =>
        nodes.slice(i + 1).map((b, j) => (
          <motion.line
            key={`${i}-${j}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="url(#lineGrad)"
            strokeWidth="1"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: (i + j) * 0.1 }}
          />
        ))
      )}
    </svg>
  )
}

export function SciFiShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])

  return (
    <section ref={ref} className="relative z-10 py-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your{' '}
            <span className="text-gradient">command center</span>
            {' '}evolves with you
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A living 3D workspace that grows. Every mission completed, every level earned — your environment transforms.
          </p>
        </motion.div>

        <motion.div style={{ scale }} className="relative aspect-[16/9] rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden">
          <ConnectionLines />

          {nodes.map((node, i) => {
            const Icon = node.icon
            return (
              <motion.div
                key={node.label}
                className="absolute flex flex-col items-center gap-2"
                style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)' }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <motion.div
                  className="w-14 h-14 rounded-2xl border border-primary/30 bg-primary/10 backdrop-blur-sm flex items-center justify-center"
                  animate={{
                    boxShadow: ['0 0 0px rgba(168,85,247,0)', '0 0 20px rgba(168,85,247,0.3)', '0 0 0px rgba(168,85,247,0)'],
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                >
                  <Icon className="w-6 h-6 text-primary" />
                </motion.div>
                <span className="text-xs text-muted-foreground font-mono">{node.label}</span>
              </motion.div>
            )
          })}

          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 p-8 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-muted-foreground font-mono">System Online</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="flex items-center gap-4 text-xs text-muted-foreground font-mono"
            >
              <span>Level 12</span>
              <span className="w-24 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  initial={{ width: 0 }}
                  whileInView={{ width: '65%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 1 }}
                />
              </span>
              <span>1,247 XP</span>
            </motion.div>
          </div>

          <motion.div
            className="absolute top-4 right-4 px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
          >
            <span className="text-[10px] text-muted-foreground font-mono tracking-wider uppercase">v2.4.1 · Quantum</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
