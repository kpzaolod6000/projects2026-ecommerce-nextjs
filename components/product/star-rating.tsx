import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  reviewCount?: number
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
  className?: string
}

export function StarRating({
  rating,
  reviewCount,
  size = 'sm',
  showCount = true,
  className,
}: StarRatingProps) {
  const starSizes = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' }
  const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star
          const partial = !filled && rating > star - 1
          const fillPercent = partial ? (rating - (star - 1)) * 100 : 0

          return (
            <span key={star} className="relative inline-block">
              <Star
                className={cn(starSizes[size], 'text-gray-200')}
                fill="currentColor"
              />
              {(filled || partial) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: filled ? '100%' : `${fillPercent}%` }}
                >
                  <Star
                    className={cn(starSizes[size], 'text-amber-400')}
                    fill="currentColor"
                  />
                </span>
              )}
            </span>
          )
        })}
      </div>
      {showCount && (
        <span className={cn('text-muted-foreground', textSizes[size])}>
          {rating.toFixed(1)}
          {reviewCount !== undefined && (
            <span className="ml-0.5">({reviewCount.toLocaleString()})</span>
          )}
        </span>
      )}
    </div>
  )
}
