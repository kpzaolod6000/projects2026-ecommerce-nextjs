'use client'

import { SortOption, FilterState } from '@/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { X, SlidersHorizontal } from 'lucide-react'

interface FilterBarProps {
  total: number
  sort: SortOption
  onSortChange: (sort: SortOption) => void
  filters: FilterState
  onRemoveFilter: (key: keyof FilterState, value?: string) => void
  onOpenFilters?: () => void
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rating' },
  { value: 'name-asc', label: 'Name: A-Z' },
]

export function FilterBar({
  total,
  sort,
  onSortChange,
  filters,
  onRemoveFilter,
  onOpenFilters,
}: FilterBarProps) {
  const activeChips: { label: string; onRemove: () => void }[] = []

  filters.categories.forEach((cat) =>
    activeChips.push({ label: cat, onRemove: () => onRemoveFilter('categories', cat) })
  )
  filters.brands.forEach((brand) =>
    activeChips.push({ label: brand, onRemove: () => onRemoveFilter('brands', brand) })
  )
  if (filters.inStock) activeChips.push({ label: 'In Stock', onRemove: () => onRemoveFilter('inStock') })
  if (filters.isOnSale) activeChips.push({ label: 'On Sale', onRemove: () => onRemoveFilter('isOnSale') })
  if (filters.isNew) activeChips.push({ label: 'New', onRemove: () => onRemoveFilter('isNew') })
  if (filters.minRating > 0)
    activeChips.push({
      label: `${filters.minRating}+ Stars`,
      onRemove: () => onRemoveFilter('minRating'),
    })

  return (
    <div className="mb-4 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onOpenFilters && (
            <Button variant="outline" size="sm" onClick={onOpenFilters} className="lg:hidden">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          )}
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{total}</span> products
          </p>
        </div>

        <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
          <SelectTrigger className="w-[190px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active filter chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeChips.map((chip) => (
            <span
              key={chip.label}
              className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              {chip.label}
              <button onClick={chip.onRemove} aria-label={`Remove ${chip.label} filter`}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
