import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeProduct } from '@/lib/serialize'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const product = await db.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        category: true,
        variants: true,
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ product: serializeProduct(product) })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
