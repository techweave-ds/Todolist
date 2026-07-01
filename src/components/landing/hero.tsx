'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles, Eye, Rocket } from 'lucide-react'

const words = ['Transform', 'Your', 'Digital', 'Life']

const floatingShapes = [
  { shape: 'circle', size: 60, x: '10%', y: '20%', delay: 0, duration: 6 },
  { shape: 'square', size: 40, x: '85%', y: '30%', delay: 1, duration: 8 },
  { shape: 'triangle', size: 50, x: '20%', y: '70%', delay: 2, duration: 7 },
  { shape: 'diamond', size: 35, x: '75%', y: '65%', delay: 0.5, duration: 9 },
  { shape: 'circle', size: 80, x: '50%', y: '15%', delay: 1.5, duration: 10 },
]

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      <motion.div style={{ y, opacity }} className="flex flex-col items-center text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs text-primary mb-8"
        >
          <Sparkles className="w-3 h-3" />
          AI-Powered Productivity OS
        </motion.div>

        <div className="mb-6">
          {words.map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 40, rotateX: -20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="inline-block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mr-4 last:mr-0"
              style={{
                background: i === words.length - 1
                  ? 'linear-gradient(135deg, var(--primary), var(--accent))'
                  : 'none',
                WebkitBackgroundClip: i === words.length - 1 ? 'text' : 'unset',
                WebkitTextFillColor: i === words.length - 1 ? 'transparent' : 'unset',
                backgroundClip: i === words.length - 1 ? 'text' : 'unset',
              }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Turn tasks into missions, goals into campaigns, and progress into a living 3D workspace.
          <br />
          <span className="text-primary/80">AI plans your week. Focus tracks your flow.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="/register"
            className="group relative flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium overflow-hidden"
          >
            <span className="relative z-10">Start Free</span>
            <ArrowRight className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-1" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{ opacity: 0.3 }}
            />
          </Link>
          <Link
            href="/demo"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl font-medium hover:bg-white/[0.06] transition-all"
          >
            <Eye className="w-4 h-4" /> Tour the App
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mt-12 flex items-center gap-2 text-xs text-muted-foreground"
        >
          <Rocket className="w-3 h-3" />
          <span>No credit card. No setup. Your command center is online in seconds.</span>
        </motion.div>
      </motion.div>

      {floatingShapes.map((s, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ left: s.x, top: s.y }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 180, 360],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: s.delay,
          }}
        >
          <div
            className="border border-primary/20 bg-primary/5 backdrop-blur-sm"
            style={{
              width: s.size,
              height: s.size,
              borderRadius: s.shape === 'circle' ? '50%' : s.shape === 'square' ? '8px' : s.shape === 'triangle' ? '0' : '4px',
              transform: s.shape === 'triangle' ? 'rotate(45deg)' : s.shape === 'diamond' ? 'rotate(45deg)' : 'none',
              clipPath: s.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
            }}
          />
        </motion.div>
      ))}
    </section>
  )
}
