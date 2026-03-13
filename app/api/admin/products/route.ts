import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { serializeProduct } from '@/lib/serialize'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const { searchParams } = request.nextUrl
    const search = searchParams.get('search') ?? ''
    const status = searchParams.get('status') ?? ''
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
    const limit = Math.min(100, parseInt(searchParams.get('limit') ?? '20'))

    const where: Prisma.ProductWhereInput = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (status && ['ACTIVE', 'DRAFT', 'ARCHIVED'].includes(status)) {
      where.status = status as 'ACTIVE' | 'DRAFT' | 'ARCHIVED'
    }

    const [total, products] = await Promise.all([
      db.product.count({ where }),
      db.product.findMany({
        where,
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          category: true,
          variants: true,
        },
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
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

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const body = await request.json()
    const {
      name, slug, description, price, comparePrice, sku, stock,
      brand, categoryId, isFeatured, isOnSale, isNew, status,
      specs, tags, images,
    } = body

    const product = await db.product.create({
      data: {
        name,
        slug,
        description,
        price,
        comparePrice: comparePrice ?? null,
        sku,
        stock: stock ?? 0,
        brand,
        categoryId,
        isFeatured: isFeatured ?? false,
        isOnSale: isOnSale ?? false,
        isNew: isNew ?? false,
        status: status ?? 'ACTIVE',
        specs: specs ?? {},
        tags: tags ?? [],
        images: images
          ? {
              create: images.map((img: { url: string; alt?: string; isPrimary?: boolean; sortOrder?: number }) => ({
                url: img.url,
                alt: img.alt ?? null,
                isPrimary: img.isPrimary ?? false,
                sortOrder: img.sortOrder ?? 0,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
        category: true,
        variants: true,
      },
    })

    return NextResponse.json({ product: serializeProduct(product) }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
