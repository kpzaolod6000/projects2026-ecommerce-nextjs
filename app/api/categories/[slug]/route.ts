import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeProduct } from '@/lib/serialize'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const category = await db.category.findUnique({
      where: { slug },
      include: {
        _count: { select: { products: true } },
        products: {
          where: { status: 'ACTIVE' },
          include: {
            images: { orderBy: { sortOrder: 'asc' } },
            category: true,
            variants: true,
          },
          orderBy: { isFeatured: 'desc' },
        },
      },
    })

    if (!category) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({
      category: {
        ...category,
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString(),
        products: category.products.map(serializeProduct),
      },
    })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
