import { formatPrice, getDiscountPercent } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface PriceDisplayProps {
  price: number
  comparePrice?: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function PriceDisplay({
  price,
  comparePrice,
  className,
  size = 'md',
}: PriceDisplayProps) {
  const discount = comparePrice ? getDiscountPercent(price, comparePrice) : 0

  const sizeClasses = {
    sm: { price: 'text-sm font-semibold', compare: 'text-xs', badge: 'text-xs px-1' },
    md: { price: 'text-lg font-bold', compare: 'text-sm', badge: 'text-xs px-1.5 py-0.5' },
    lg: { price: 'text-2xl font-bold', compare: 'text-base', badge: 'text-sm px-2 py-0.5' },
  }

  const cls = sizeClasses[size]

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      <span className={cn('text-foreground', cls.price)}>{formatPrice(price)}</span>
      {comparePrice && comparePrice > price && (
        <>
          <span className={cn('text-muted-foreground line-through', cls.compare)}>
            {formatPrice(comparePrice)}
          </span>
          <span
            className={cn(
              'rounded bg-red-100 font-semibold text-red-600',
              cls.badge
            )}
          >
            -{discount}%
          </span>
        </>
      )}
    </div>
  )
}
