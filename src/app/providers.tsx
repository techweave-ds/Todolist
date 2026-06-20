'use client'

import { useEffect } from 'react'
import { audioEngine } from '@/audio/engine/audio-engine'
import { registerAllSubscribers } from '@/core/events/subscribers'
import { CommandPalette } from '@/components/layout/command-palette'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    audioEngine.init()
    registerAllSubscribers()
  }, [])

  return (
    <>
      {children}
      <CommandPalette />
    </>
  )
}
