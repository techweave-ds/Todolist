'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { initAnalytics, capturePageView } from '@/lib/analytics'

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      initAnalytics()
      initialized.current = true
    }
  }, [])

  useEffect(() => {
    capturePageView()
  }, [pathname, searchParams])

  return null
}
