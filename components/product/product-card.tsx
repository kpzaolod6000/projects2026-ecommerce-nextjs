import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PriceDisplay } from '@/components/ui/price-display'
import { StarRating } from '@/components/product/star-rating'
import { ProductBadge } from '@/components/product/product-badge'
import { WishlistButton } from '@/components/product/wishlist-button'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0]

  return (
    <Card className="group relative overflow-hidden border border-border transition-shadow hover:shadow-md py-0">
      {/* Badges */}
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
        {product.isNew && <ProductBadge type="new" />}
        {product.isOnSale && <ProductBadge type="sale" />}
        {product.stock === 0 && <ProductBadge type="out-of-stock" />}
      </div>

      {/* Wishlist */}
      <div className="absolute right-2 top-2 z-10">
        <WishlistButton productId={product.id} size="sm" />
      </div>

      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block overflow-hidden bg-gray-50">
        <div className="relative aspect-square">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt ?? product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 text-sm">
              No image
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-3">
        {/* Brand */}
        <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {product.brand}
        </p>

        {/* Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="mb-1.5 line-clamp-2 text-sm font-medium leading-tight text-foreground hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <StarRating
          rating={product.rating}
          reviewCount={product.reviewCount}
          className="mb-2"
        />

        {/* Price */}
        <PriceDisplay
          price={product.price}
          comparePrice={product.comparePrice}
          size="sm"
          className="mb-3"
        />

        {/* Add to Cart */}
        <Button
          size="sm"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={product.stock === 0}
        >
          <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardContent>
    </Card>
  )
}
