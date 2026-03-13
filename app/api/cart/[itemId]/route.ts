import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { itemId } = await params
    const body = await request.json()
    const { quantity } = body

    if (quantity === undefined || quantity < 1) {
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 })
    }

    const item = await db.cartItem.findFirst({
      where: { id: itemId, userId: session.user.id },
    })

    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const updated = await db.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    })

    return NextResponse.json({ item: updated })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { itemId } = await params

    const item = await db.cartItem.findFirst({
      where: { id: itemId, userId: session.user.id },
    })

    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await db.cartItem.delete({ where: { id: itemId } })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
