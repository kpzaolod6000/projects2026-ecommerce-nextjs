import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { categories, products } from '../lib/mock-data'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const db = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Upsert categories
  for (const cat of categories) {
    await db.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description ?? null,
        image: cat.image ?? null,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description ?? null,
        image: cat.image ?? null,
      },
    })
    console.log(`  Category: ${cat.name}`)
  }

  // Build a map from mock categoryId to real DB category id
  const categorySlugToId: Record<string, string> = {}
  for (const cat of categories) {
    const dbCat = await db.category.findUnique({ where: { slug: cat.slug } })
    if (dbCat) categorySlugToId[cat.id] = dbCat.id
  }

  // Upsert products
  for (const p of products) {
    const categoryId = categorySlugToId[p.categoryId]
    if (!categoryId) {
      console.warn(`  Skipping ${p.name} — category not found`)
      continue
    }

    const created = await db.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        price: p.price,
        comparePrice: p.comparePrice ?? null,
        sku: p.sku,
        stock: p.stock,
        brand: p.brand,
        rating: p.rating,
        reviewCount: p.reviewCount,
        isFeatured: p.isFeatured,
        isOnSale: p.isOnSale,
        isNew: p.isNew,
        status: p.status,
        specs: p.specs as object,
        tags: p.tags,
        categoryId,
      },
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        comparePrice: p.comparePrice ?? null,
        sku: p.sku,
        stock: p.stock,
        brand: p.brand,
        rating: p.rating,
        reviewCount: p.reviewCount,
        isFeatured: p.isFeatured,
        isOnSale: p.isOnSale,
        isNew: p.isNew,
        status: p.status,
        specs: p.specs as object,
        tags: p.tags,
        categoryId,
      },
    })

    // Delete and re-create images to stay consistent
    await db.productImage.deleteMany({ where: { productId: created.id } })
    for (const img of p.images) {
      await db.productImage.create({
        data: {
          url: img.url,
          alt: img.alt ?? null,
          isPrimary: img.isPrimary,
          sortOrder: img.sortOrder,
          productId: created.id,
        },
      })
    }

    // Create color variants if product has colors
    if (p.colors && p.colors.length > 0) {
      for (const color of p.colors) {
        const variantSku = `${p.sku}-${color.toUpperCase().replace(/\s/g, '-')}`
        const existing = await db.productVariant.findUnique({ where: { sku: variantSku } })
        if (!existing) {
          await db.productVariant.create({
            data: {
              sku: variantSku,
              name: color,
              attributes: { color },
              stock: Math.floor(p.stock / (p.colors?.length ?? 1)),
              productId: created.id,
            },
          })
        }
      }
    }

    console.log(`  Product: ${p.name}`)
  }

  console.log('Seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
