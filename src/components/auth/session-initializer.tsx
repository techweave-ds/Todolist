'use client'

import { useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAppStore } from '@/store/app-store'
import { ensureUserProfile } from '@/app/actions'
import { DEMO_COOKIE } from '@/lib/demo'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function SessionInitializer() {
  const setUserId = useAppStore(s => s.setUserId)
  const setDemoMode = useAppStore(s => s.setDemoMode)

  useEffect(() => {
    if (getCookie(DEMO_COOKIE) === 'true') {
      setDemoMode()
      return
    }

    const localUserId = getCookie('local_user_id')
    if (localUserId) {
      setUserId(localUserId)
      return
    }

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

    return () => subscription.unsubscribe()
  }, [setUserId, setDemoMode])

  return null
}
