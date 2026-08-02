'use client'

import { useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAppStore } from '@/store/app-store'
import { ensureUserProfile, getCurrentUser } from '@/app/actions'

export function SessionInitializer() {
  const setUserId = useAppStore(s => s.setUserId)
  const setDemoMode = useAppStore(s => s.setDemoMode)

  useEffect(() => {
    let cancelled = false

    const initLocal = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (cancelled) return
        if (!currentUser) return

        if (currentUser.isDemo) {
          setDemoMode()
          return
        }

        setUserId(currentUser.userId)
      } catch {
        // silent
      }
    }

    initLocal()

    if (!isSupabaseConfigured || !supabase) return

    const init = async () => {
      try {
        const { data: { session }, error } = await supabase!.auth.getSession()
        if (error) return
        if (session?.user) {
          setUserId(session.user.id)
          try {
            await ensureUserProfile(session.user.id, session.user.user_metadata?.display_name as string)
          } catch {
            // profile creation is best-effort
          }
        }
      } catch {
        // silent
      }
    }
    init()

    const { data: { subscription } } = supabase!.auth.onAuthStateChange(async (event, session) => {
      const id = session?.user?.id ?? null
      setUserId(id)
      if (id && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        try {
          await ensureUserProfile(id, session?.user?.user_metadata?.display_name as string)
        } catch {
          // best-effort
        }
      }
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [setUserId, setDemoMode])

  return null
}
