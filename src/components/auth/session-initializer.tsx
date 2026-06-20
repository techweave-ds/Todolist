'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAppStore } from '@/store/app-store'
import { ensureUserProfile } from '@/app/actions'
import { DEMO_COOKIE } from '@/lib/demo'

export function SessionInitializer() {
  const setUserId = useAppStore(s => s.setUserId)
  const setDemoMode = useAppStore(s => s.setDemoMode)

  useEffect(() => {
    if (document.cookie.includes(`${DEMO_COOKIE}=true`)) {
      setDemoMode()
      return
    }

    const init = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
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
        // silent — session may not be available yet
      }
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
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

    return () => subscription.unsubscribe()
  }, [setUserId, setDemoMode])

  return null
}
