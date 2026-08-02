import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

async function getUserId(): Promise<string | null> {
  const sessionUser = await getSessionUser().catch(() => null)
  if (sessionUser) return sessionUser.id

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null
  const { createSupabaseServerClient } = await import('@/lib/supabase-server')
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

export async function GET() {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const prefs = await prisma.audioPreference.findUnique({ where: { userId } })
    return NextResponse.json(prefs ?? {})
  } catch {
    return NextResponse.json({})
  }
}

export async function POST(request: NextRequest) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json()
    const prefs = await prisma.audioPreference.upsert({
      where: { userId },
      create: { userId, ...body },
      update: body,
    })
    return NextResponse.json(prefs)
  } catch {
    return NextResponse.json({ error: 'Failed to save audio prefs' }, { status: 500 })
  }
}
