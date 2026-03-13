import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { serializeOrder } from '@/lib/serialize'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const { id } = await params
    const body = await request.json()
    const { status, trackingNumber } = body

    const order = await db.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(trackingNumber !== undefined && { trackingNumber }),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
                category: true,
                variants: true,
              },
            },
          },
        },
        shippingAddress: true,
      },
    })

    return NextResponse.json({ order: serializeOrder(order) })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
