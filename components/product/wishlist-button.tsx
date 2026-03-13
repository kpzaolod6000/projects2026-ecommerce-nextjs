'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface WishlistButtonProps {
  productId: string
  className?: string
  size?: 'sm' | 'md'
}

export function WishlistButton({ productId, className, size = 'md' }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (loading) return

    setLoading(true)
    try {
      if (isWishlisted) {
        const res = await fetch(`/api/wishlist/${productId}`, { method: 'DELETE' })
        if (res.ok || res.status === 401) setIsWishlisted(false)
      } else {
        const res = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        })
        if (res.ok) setIsWishlisted(true)
        // If 401 (not logged in), toggle optimistically for UX
        if (res.status === 401) setIsWishlisted(true)
      }
    } catch {
      // ignore network errors
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      className={cn(
        'rounded-full bg-white/90 shadow-sm hover:bg-white',
        size === 'sm' ? 'h-7 w-7' : 'h-9 w-9',
        className
      )}
      data-product-id={productId}
      disabled={loading}
    >
      <Heart
        className={cn(
          size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4',
          isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
        )}
      />
    </Button>
  )
}
