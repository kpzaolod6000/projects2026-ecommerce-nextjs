import { Product } from '@/types'
import { ProductCard } from '@/components/product/product-card'
import { Skeleton } from '@/components/ui/skeleton'
import { PackageSearch } from 'lucide-react'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  columns?: 2 | 3 | 4
}

const colClasses = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
}

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Skeleton className="aspect-square w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  )
}

export function ProductGrid({ products, loading = false, columns = 4 }: ProductGridProps) {
  if (loading) {
    return (
      <div className={`grid gap-4 ${colClasses[columns]}`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <PackageSearch className="mb-4 h-16 w-16 text-muted-foreground/40" />
        <h3 className="mb-2 text-lg font-semibold text-foreground">No products found</h3>
        <p className="text-sm text-muted-foreground">
          Try adjusting your filters or search term.
        </p>
      </div>
    )
  }

  return (
    <div className={`grid gap-4 ${colClasses[columns]}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
