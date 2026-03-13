import Link from 'next/link'
import { db } from '@/lib/db'
import { serializeProduct } from '@/lib/serialize'
import { ProductGrid } from '@/components/product/product-grid'

export async function FeaturedProducts() {
  const dbProducts = await db.product.findMany({
    where: { isFeatured: true, status: 'ACTIVE' },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      category: true,
      variants: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 8,
  })

  const featured = dbProducts.map(serializeProduct)

  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">Featured Products</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Hand-picked products for you
            </p>
          </div>
          <Link
            href="/products?sort=featured"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all →
          </Link>
        </div>
        <ProductGrid products={featured} columns={4} />
      </div>
    </section>
  )
}
