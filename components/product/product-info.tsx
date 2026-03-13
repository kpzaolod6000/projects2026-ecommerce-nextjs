'use client'

import { useState } from 'react'
import { ShoppingCart, Heart, Share2, Check, Package } from 'lucide-react'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PriceDisplay } from '@/components/ui/price-display'
import { StarRating } from '@/components/product/star-rating'
import { cn } from '@/lib/utils'

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] ?? '')
  const [addedToCart, setAddedToCart] = useState(false)

  const handleAddToCart = () => {
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const specEntries = Object.entries(product.specs)

  return (
    <div className="space-y-5">
      {/* Brand & badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wide">
          {product.brand}
        </Badge>
        {product.isNew && <Badge className="bg-blue-500 text-white text-xs">New</Badge>}
        {product.isOnSale && <Badge className="bg-red-500 text-white text-xs">Sale</Badge>}
        {product.stock === 0 && <Badge variant="secondary" className="text-xs">Out of Stock</Badge>}
      </div>

      {/* Name */}
      <h1 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">
        {product.name}
      </h1>

      {/* Rating */}
      <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />

      {/* Price */}
      <PriceDisplay
        price={product.price}
        comparePrice={product.comparePrice}
        size="lg"
      />

      <Separator />

      {/* Description */}
      <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>

      {/* Color selector */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium">
            Color: <span className="text-muted-foreground">{selectedColor}</span>
          </p>
          <div className="flex gap-2 flex-wrap">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm border-2 transition-all',
                  selectedColor === color
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-border text-foreground hover:border-muted-foreground'
                )}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-border rounded-lg">
          <button
            className="px-3 py-2 text-lg font-medium hover:bg-muted rounded-l-lg transition-colors"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <span className="w-12 text-center font-semibold">{quantity}</span>
          <button
            className="px-3 py-2 text-lg font-medium hover:bg-muted rounded-r-lg transition-colors"
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          >
            +
          </button>
        </div>
        <span className="text-sm text-muted-foreground">
          {product.stock > 0 ? (
            <span className="text-green-600 font-medium">
              {product.stock} in stock
            </span>
          ) : (
            <span className="text-red-500 font-medium">Out of stock</span>
          )}
        </span>
      </div>

      {/* CTA buttons */}
      <div className="flex gap-3">
        <Button
          className={cn(
            'flex-1 h-11 font-semibold transition-all',
            addedToCart
              ? 'bg-green-600 hover:bg-green-600'
              : 'bg-primary hover:bg-primary/90'
          )}
          disabled={product.stock === 0}
          onClick={handleAddToCart}
        >
          {addedToCart ? (
            <>
              <Check className="mr-2 h-4 w-4" /> Added!
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </>
          )}
        </Button>
        <Button variant="outline" size="icon" className="h-11 w-11">
          <Heart className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-11 w-11">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Shipping info */}
      <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
        <Package className="h-4 w-4 flex-shrink-0" />
        <span>Free shipping on this item! Dispatches within 1-2 business days.</span>
      </div>

      <Separator />

      {/* Specs table */}
      {specEntries.length > 0 && (
        <div>
          <h3 className="mb-3 font-semibold text-foreground">Specifications</h3>
          <div className="rounded-lg border border-border overflow-hidden">
            {specEntries.map(([key, value], i) => (
              <div
                key={key}
                className={cn(
                  'flex gap-4 px-4 py-2.5 text-sm',
                  i % 2 === 0 ? 'bg-muted/40' : 'bg-background'
                )}
              >
                <span className="w-40 flex-shrink-0 font-medium text-muted-foreground">{key}</span>
                <span className="text-foreground">
                  {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {product.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {product.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs capitalize">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
