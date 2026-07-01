'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  {
    quote: 'Mission Control OS turned my chaotic task list into a strategic campaign. The AI coach alone saved me hours of planning every week.',
    name: 'Alex Chen',
    role: 'Product Manager',
    gradient: 'from-purple-500/10 via-transparent to-blue-500/10',
  },
  {
    quote: 'The focus sessions with ambient sound environments completely changed how I work. My deep work time went from 2 to 5 hours daily.',
    name: 'Sarah Mitchell',
    role: 'Software Engineer',
    gradient: 'from-emerald-500/10 via-transparent to-teal-500/10',
  },
  {
    quote: 'I finally understand my productivity patterns. The analytics showed me I do my best work at 6 AM. Who knew?',
    name: 'Marcus Johnson',
    role: 'Freelance Designer',
    gradient: 'from-orange-500/10 via-transparent to-pink-500/10',
  },
  {
    quote: 'The living workspace is genius. Every achievement adds something new to my 3D environment. It makes progress tangible.',
    name: 'Priya Patel',
    role: 'Graduate Student',
    gradient: 'from-violet-500/10 via-transparent to-indigo-500/10',
  },
  {
    quote: 'I was skeptical about AI in a productivity tool. Now I cannot imagine planning my week without it. The daily briefings are eerily accurate.',
    name: 'James Wilson',
    role: 'Startup Founder',
    gradient: 'from-rose-500/10 via-transparent to-amber-500/10',
  },
]

export function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  const next = useCallback(() => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }, [])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  }

  return (
    <section className="relative z-10 py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What users{' '}
            <span className="text-gradient">are saying</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Real stories from people who transformed their productivity.
          </p>
        </motion.div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className={`p-8 md:p-12 bg-gradient-to-br ${testimonials[current].gradient}`}
              >
                <Quote className="w-8 h-8 text-primary/30 mb-6" />
                <p className="text-lg md:text-xl leading-relaxed mb-8">&ldquo;{testimonials[current].quote}&rdquo;</p>
                <div>
                  <p className="font-semibold">{testimonials[current].name}</p>
                  <p className="text-sm text-muted-foreground">{testimonials[current].role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-white/[0.06] bg-white/[0.03] flex items-center justify-center hover:bg-white/[0.06] transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === current ? 'bg-primary w-6' : 'bg-white/[0.15] hover:bg-white/[0.25]'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-white/[0.06] bg-white/[0.03] flex items-center justify-center hover:bg-white/[0.06] transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
