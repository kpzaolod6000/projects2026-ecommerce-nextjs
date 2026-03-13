import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeProduct } from '@/lib/serialize'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const search = searchParams.get('search') ?? ''
    const category = searchParams.get('category') ?? ''
    const brand = searchParams.get('brand') ?? ''
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const featured = searchParams.get('featured')
    const onSale = searchParams.get('onSale')
    const isNew = searchParams.get('isNew')
    const sort = searchParams.get('sort') ?? 'featured'
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20')))

    const where: Prisma.ProductWhereInput = {
      status: 'ACTIVE',
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { tags: { has: search.toLowerCase() } },
      ]
    }

    if (category) {
      where.category = { slug: category }
    }

    if (brand) {
      where.brand = { equals: brand, mode: 'insensitive' }
    }

    if (minPrice) {
      where.price = { ...((where.price as object) ?? {}), gte: parseFloat(minPrice) }
    }

    if (maxPrice) {
      where.price = { ...((where.price as object) ?? {}), lte: parseFloat(maxPrice) }
    }

    if (featured === 'true') where.isFeatured = true
    if (onSale === 'true') where.isOnSale = true
    if (isNew === 'true') where.isNew = true

    const orderBy: Prisma.ProductOrderByWithRelationInput = (() => {
      switch (sort) {
        case 'price-asc': return { price: 'asc' }
        case 'price-desc': return { price: 'desc' }
        case 'rating': return { rating: 'desc' }
        case 'newest': return { createdAt: 'desc' }
        case 'name-asc': return { name: 'asc' }
        default: return { isFeatured: 'desc' }
      }
    })()

    const [total, products] = await Promise.all([
      db.product.count({ where }),
      db.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          category: true,
          variants: true,
        },
      }),
    ])

    return NextResponse.json({
      products: products.map(serializeProduct),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
