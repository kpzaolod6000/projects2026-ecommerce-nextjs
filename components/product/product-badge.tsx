import { cn } from '@/lib/utils'

type BadgeType = 'new' | 'sale' | 'hot' | 'out-of-stock'

interface ProductBadgeProps {
  type: BadgeType
  className?: string
}

const badgeConfig: Record<BadgeType, { label: string; className: string }> = {
  new: {
    label: 'New',
    className: 'bg-blue-500 text-white',
  },
  sale: {
    label: 'Sale',
    className: 'bg-red-500 text-white',
  },
  hot: {
    label: 'Hot',
    className: 'bg-orange-500 text-white',
  },
  'out-of-stock': {
    label: 'Out of Stock',
    className: 'bg-gray-500 text-white',
  },
}

export function ProductBadge({ type, className }: ProductBadgeProps) {
  const config = badgeConfig[type]
  return (
    <span
      className={cn(
        'inline-block rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
