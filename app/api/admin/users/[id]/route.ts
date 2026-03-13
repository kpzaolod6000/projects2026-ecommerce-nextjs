import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { serializeUser } from '@/lib/serialize'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await requireAdmin()
  if (error) return error

  try {
    const { id } = await params
    const body = await request.json()
    const { role } = body

    // Prevent self-demotion
    if (id === session?.user?.id && role && role !== session.user.role) {
      return NextResponse.json({ error: 'Cannot change your own role' }, { status: 400 })
    }

    const user = await db.user.update({
      where: { id },
      data: {
        ...(role && { role }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ user: serializeUser(user) })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
