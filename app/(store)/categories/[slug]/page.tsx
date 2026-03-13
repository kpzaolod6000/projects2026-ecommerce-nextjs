import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { serializeProduct } from '@/lib/serialize'
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
  const category = await db.category.findUnique({ where: { slug } })
  if (!category) return { title: 'Category Not Found' }
  return {
    title: category.name,
    description: category.description ?? undefined,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params

  const category = await db.category.findUnique({
    where: { slug },
    include: {
      _count: { select: { products: true } },
    },
  })

  if (!category) {
    notFound()
  }

  const dbProducts = await db.product.findMany({
    where: { categoryId: category.id, status: 'ACTIVE' },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      category: true,
      variants: true,
    },
    orderBy: { isFeatured: 'desc' },
  })

  const categoryProducts = dbProducts.map(serializeProduct)

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
            <BreadcrumbPage>{category.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{category.name}</h1>
        {category.description && (
          <p className="mt-1 text-muted-foreground">{category.description}</p>
        )}
        <p className="mt-1 text-sm text-muted-foreground">
          {categoryProducts.length} products
        </p>
      </div>

      {categoryProducts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">
            No products found in this category.{' '}
            <Link href="/products" className="text-primary hover:underline">
              Browse all products
            </Link>
          </p>
        </div>
      ) : (
        <ProductGrid products={categoryProducts} columns={4} />
      )}
    </div>
  )
}
