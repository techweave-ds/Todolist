'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Rocket } from 'lucide-react'

export function FinalCTA() {
  return (
    <section className="relative z-10 py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.05] via-background to-accent/[0.05] backdrop-blur-xl p-12 md:p-16 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />
          <motion.div
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-accent/10 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6"
            >
              <Rocket className="w-8 h-8 text-primary" />
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Ready to{' '}
              <span className="text-gradient">launch</span>
              {' '}your productivity?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-10 text-base leading-relaxed">
              No credit card. No configuration. Sign up and your command center is online in seconds.
              Join thousands of users who have transformed how they work.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="group relative flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium overflow-hidden"
              >
                <span className="relative z-10">Create Free Account</span>
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
                Watch Demo
              </Link>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              Free tier includes unlimited missions, 3 campaigns, and core analytics.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
