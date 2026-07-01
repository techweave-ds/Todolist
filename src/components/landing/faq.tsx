'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  { q: 'What makes Mission Control OS different from other productivity apps?', a: 'Most apps track tasks. We build a complete operating system — missions, campaigns, AI strategy, focus sessions, achievements, analytics, and a living 3D workspace that grows with you.' },
  { q: 'How does the AI Coach work?', a: 'The AI analyzes your goals, breaks them into weekly plans, writes daily briefings, and provides coaching when you lose momentum. It adapts to your working style over time.' },
  { q: 'Is my data private and secure?', a: 'Yes. All data is encrypted in transit and at rest. Missions, notes, and analytics are yours. We do not train AI models on your personal data.' },
  { q: 'Can I use it for team projects?', a: 'Currently Mission Control OS is designed for individual use. Team features — shared campaigns, collaborative workspaces — are on the roadmap for 2026.' },
  { q: 'What platforms are supported?', a: 'Web (desktop and mobile browsers). Native iOS and Android apps are in development with a Q3 2026 release target.' },
  { q: 'Is there a free tier?', a: 'Yes. The free tier includes unlimited missions, 3 active campaigns, basic focus sessions, and core analytics. Premium unlocks AI coaching, unlimited campaigns, all audio environments, and the full 3D workspace.' },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="relative z-10 py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently asked{' '}
            <span className="text-gradient">questions</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need to know about Mission Control OS.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.03] transition-colors"
              >
                <span className="text-sm font-medium pr-4">{faq.q}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
