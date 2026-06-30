'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWorkspaceStore } from '@/store/workspace-store'

export function UnlockNotification() {
  const lastUnlock = useWorkspaceStore(s => s.lastUnlock)
  const dismissUnlock = useWorkspaceStore(s => s.dismissUnlock)

  useEffect(() => {
    if (lastUnlock) {
      const t = setTimeout(dismissUnlock, 4000)
      return () => clearTimeout(t)
    }
  }, [lastUnlock, dismissUnlock])

  return (
    <AnimatePresence>
      {lastUnlock && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="fixed top-1/4 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="glass rounded-2xl px-8 py-6 text-center border border-primary/20 shadow-2xl">
            <div className="text-3xl mb-2">✨</div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Workspace Unlocked
            </p>
            <p className="text-lg font-bold text-primary">
              {lastUnlock.objectName}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Stage {lastUnlock.stage}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
