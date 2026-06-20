import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { DEMO_USER_ID, DEMO_COOKIE } from '@/lib/demo'
import { cookies } from 'next/headers'

async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  const isDemo = cookieStore.get(DEMO_COOKIE)?.value === 'true'
  if (isDemo) return DEMO_USER_ID
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
