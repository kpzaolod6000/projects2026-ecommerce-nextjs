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
    const items = await db.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: {
            images: { orderBy: { sortOrder: 'asc' } },
            category: true,
            variants: true,
          },
        },
        variant: true,
      },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({
      items: items.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        product: serializeProduct(item.product),
        variant: item.variant
          ? {
              ...item.variant,
              price: item.variant.price ? Number(item.variant.price) : undefined,
              comparePrice: item.variant.comparePrice ? Number(item.variant.comparePrice) : undefined,
              createdAt: item.variant.createdAt.toISOString(),
              updatedAt: item.variant.updatedAt.toISOString(),
            }
          : null,
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
    const { productId, variantId, quantity = 1 } = body

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 })
    }

    const existing = await db.cartItem.findUnique({
      where: {
        userId_productId_variantId: {
          userId: session.user.id,
          productId,
          variantId: variantId ?? null,
        },
      },
    })

    let item
    if (existing) {
      item = await db.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      })
    } else {
      item = await db.cartItem.create({
        data: {
          userId: session.user.id,
          productId,
          variantId: variantId ?? null,
          quantity,
        },
      })
    }

    return NextResponse.json({ item })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
