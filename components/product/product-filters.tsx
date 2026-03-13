'use client'

import { FilterState, Category } from '@/types'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { Star } from 'lucide-react'

interface ProductFiltersProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  categories?: Category[]
  brands?: string[]
  maxPrice?: number
}

export function ProductFilters({
  filters,
  onChange,
  categories = [],
  brands = [],
  maxPrice = 5000,
}: ProductFiltersProps) {
  const update = (partial: Partial<FilterState>) =>
    onChange({ ...filters, ...partial })

  const toggleCategory = (slug: string) => {
    const next = filters.categories.includes(slug)
      ? filters.categories.filter((c) => c !== slug)
      : [...filters.categories, slug]
    update({ categories: next })
  }

  const toggleBrand = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand]
    update({ brands: next })
  }

  const resetAll = () =>
    onChange({
      categories: [],
      brands: [],
      minPrice: 0,
      maxPrice,
      minRating: 0,
      inStock: false,
      isOnSale: false,
      isNew: false,
    })

  return (
    <aside className="w-full space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Filters</h2>
        <Button variant="ghost" size="sm" onClick={resetAll} className="h-7 text-xs text-muted-foreground">
          Clear all
        </Button>
      </div>

      <Separator />

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Categories
          </h3>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2">
                <Checkbox
                  id={`cat-${cat.slug}`}
                  checked={filters.categories.includes(cat.slug)}
                  onCheckedChange={() => toggleCategory(cat.slug)}
                />
                <Label
                  htmlFor={`cat-${cat.slug}`}
                  className="flex flex-1 cursor-pointer items-center justify-between text-sm"
                >
                  {cat.name}
                  <span className="text-xs text-muted-foreground">
                    ({cat._count?.products ?? 0})
                  </span>
                </Label>
              </div>
            ))}
          </div>
          <Separator className="mt-5" />
        </div>
      )}

      {/* Price Range */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Price Range
        </h3>
        <div className="px-1">
          <Slider
            min={0}
            max={maxPrice}
            step={10}
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={([min, max]) => update({ minPrice: min, maxPrice: max })}
            className="mb-3"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatPrice(filters.minPrice)}</span>
            <span>{formatPrice(filters.maxPrice)}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Brands
          </h3>
          <div className="space-y-2">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center gap-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={() => toggleBrand(brand)}
                />
                <Label
                  htmlFor={`brand-${brand}`}
                  className="cursor-pointer text-sm"
                >
                  {brand}
                </Label>
              </div>
            ))}
          </div>
          <Separator className="mt-5" />
        </div>
      )}

      {/* Rating */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Minimum Rating
        </h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => update({ minRating: filters.minRating === rating ? 0 : rating })}
              className={`flex w-full items-center gap-1.5 rounded px-2 py-1 text-sm transition-colors ${
                filters.minRating === rating
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}`}
                />
              ))}
              <span className="text-xs text-muted-foreground">& up</span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Quick filters */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Availability
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="in-stock"
              checked={filters.inStock}
              onCheckedChange={(v) => update({ inStock: !!v })}
            />
            <Label htmlFor="in-stock" className="cursor-pointer text-sm">In Stock Only</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="on-sale"
              checked={filters.isOnSale}
              onCheckedChange={(v) => update({ isOnSale: !!v })}
            />
            <Label htmlFor="on-sale" className="cursor-pointer text-sm">On Sale</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="is-new"
              checked={filters.isNew}
              onCheckedChange={(v) => update({ isNew: !!v })}
            />
            <Label htmlFor="is-new" className="cursor-pointer text-sm">New Arrivals</Label>
          </div>
        </div>
      </div>
    </aside>
  )
}
