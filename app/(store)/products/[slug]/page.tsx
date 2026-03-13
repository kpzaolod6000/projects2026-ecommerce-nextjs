import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { serializeProduct } from '@/lib/serialize'
import { ProductImages } from '@/components/product/product-images'
import { ProductInfo } from '@/components/product/product-info'
import { ProductGrid } from '@/components/product/product-grid'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await db.product.findUnique({ where: { slug } })
  if (!product) return { title: 'Product Not Found' }
  return {
    title: product.name,
    description: product.description.slice(0, 155),
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params

  const dbProduct = await db.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      category: true,
      variants: true,
    },
  })

  if (!dbProduct) {
    notFound()
  }

  const product = serializeProduct(dbProduct)

  const relatedDb = await db.product.findMany({
    where: {
      categoryId: dbProduct.categoryId,
      id: { not: dbProduct.id },
      status: 'ACTIVE',
    },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      category: true,
      variants: true,
    },
    take: 4,
  })

  const related = relatedDb.map(serializeProduct)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/products">Products</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/categories/${product.category.slug}`}>
                {product.category.name}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="line-clamp-1 max-w-[200px]">
              {product.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductImages images={product.images} productName={product.name} />
        <ProductInfo product={product} />
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-foreground">Related Products</h2>
          <ProductGrid products={related} columns={4} />
        </section>
      )}
    </div>
  )
}
