'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      router.push('/dashboard')
      return
    }
    const handleCallback = async () => {
      try {
        const { data, error } = await supabase!.auth.getSession()
        if (error) {
          setError('Authentication failed')
          return
        }
        if (data.session) {
          router.push('/dashboard')
        } else {
          setError('No session found')
        }
      } catch {
        setError('An unexpected error occurred')
      }
    }
    handleCallback()
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-red-500">{error}</p>
          <button onClick={() => router.push('/login')} className="text-sm text-primary hover:underline">
            Back to login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/20 animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
}
