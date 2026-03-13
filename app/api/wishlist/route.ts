import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { serializeProduct } from '@/lib/serialize'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const items = await db.wishlist.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: {
            images: { orderBy: { sortOrder: 'asc' } },
            category: true,
            variants: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      items: items.map((item) => ({
        id: item.id,
        productId: item.productId,
        product: serializeProduct(item.product),
      })),
    })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 })
    }

    const item = await db.wishlist.upsert({
      where: {
        userId_productId: { userId: session.user.id, productId },
      },
      update: {},
      create: { userId: session.user.id, productId },
    })

    return NextResponse.json({ item }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
