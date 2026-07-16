import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimiters, checkRateLimit } from '@/lib/rate-limit'

export async function GET() {
  checkRateLimit(rateLimiters.api, `health:global`)
  const checks: Record<string, string | { status: string; error?: string }> = {
    uptime: process.uptime().toFixed(2) + 's',
    timestamp: new Date().toISOString(),
  }

  try {
    await prisma.$queryRaw`SELECT 1`
    checks.database = { status: 'connected' }
  } catch (error) {
    checks.database = { status: 'error', error: error instanceof Error ? error.message : 'Unknown database error' }
  }

  const allOk = Object.values(checks).every(
    (v) => typeof v === 'string' || (typeof v === 'object' && v.status === 'connected')
  )

  return NextResponse.json(
    { status: allOk ? 'healthy' : 'degraded', checks },
    { status: allOk ? 200 : 503 }
  )
}
