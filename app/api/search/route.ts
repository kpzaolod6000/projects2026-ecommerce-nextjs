import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeProduct } from '@/lib/serialize'

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get('q') ?? ''

    if (!q.trim()) {
      return NextResponse.json({ products: [], total: 0 })
    }

    const products = await db.product.findMany({
      where: {
        status: 'ACTIVE',
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { brand: { contains: q, mode: 'insensitive' } },
          { tags: { has: q.toLowerCase() } },
        ],
      },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        category: true,
        variants: true,
      },
      orderBy: { isFeatured: 'desc' },
      take: 50,
    })

    return NextResponse.json({
      products: products.map(serializeProduct),
      total: products.length,
    })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
