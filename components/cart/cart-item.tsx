'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Minus, Plus } from 'lucide-react'
import { CartItem as CartItemType } from '@/types'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

interface CartItemProps {
  item: CartItemType
  onQuantityChange: (id: string, qty: number) => void
  onRemove: (id: string) => void
}

export function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  const { product, quantity } = item
  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0]

  return (
    <div className="flex gap-4 py-5 border-b border-border last:border-0">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="flex-shrink-0">
        <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-gray-50 border border-border">
          {primaryImage && (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt ?? product.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <Link
          href={`/products/${product.slug}`}
          className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-2"
        >
          {product.name}
        </Link>
        <p className="text-xs text-muted-foreground">{product.brand}</p>
        {item.selectedColor && (
          <p className="text-xs text-muted-foreground">Color: {item.selectedColor}</p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 flex-wrap">
          {/* Quantity controls */}
          <div className="flex items-center gap-1 border border-border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onQuantityChange(item.id, Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onQuantityChange(item.id, Math.min(product.stock, quantity + 1))}
              disabled={quantity >= product.stock}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-semibold text-foreground">
              {formatPrice(product.price * quantity)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-red-500"
              onClick={() => onRemove(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
