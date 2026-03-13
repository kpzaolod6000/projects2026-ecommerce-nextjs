'use client'

import { useState, useEffect, useCallback } from 'react'
import { FilterState, SortOption, Product, Category } from '@/types'
import { ProductGrid } from '@/components/product/product-grid'
import { ProductFilters } from '@/components/product/product-filters'
import { FilterBar } from '@/components/sections/filter-bar'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

const DEFAULT_MAX_PRICE = 5000

const defaultFilters: FilterState = {
  categories: [],
  brands: [],
  minPrice: 0,
  maxPrice: DEFAULT_MAX_PRICE,
  minRating: 0,
  inStock: false,
  isOnSale: false,
  isNew: false,
}

export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [sort, setSort] = useState<SortOption>('featured')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState(DEFAULT_MAX_PRICE)
  const [loading, setLoading] = useState(true)

  // Load categories and brands once
  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => setCategories(data.categories ?? []))
      .catch(() => {})

    // Get max price from all products
    fetch('/api/products?limit=100&sort=price-desc')
      .then((r) => r.json())
      .then((data) => {
        if (data.products?.length > 0) {
          const allPrices = data.products.map((p: Product) => p.price)
          const allBrands = [...new Set<string>(data.products.map((p: Product) => p.brand))].sort()
          const max = Math.ceil(Math.max(...allPrices) / 100) * 100
          setMaxPrice(max)
          setFilters((f) => ({ ...f, maxPrice: max }))
          setBrands(allBrands)
        }
      })
      .catch(() => {})
  }, [])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.categories.length === 1) params.set('category', filters.categories[0])
      if (filters.brands.length === 1) params.set('brand', filters.brands[0])
      if (filters.minPrice > 0) params.set('minPrice', String(filters.minPrice))
      if (filters.maxPrice < maxPrice) params.set('maxPrice', String(filters.maxPrice))
      if (filters.isOnSale) params.set('onSale', 'true')
      if (filters.isNew) params.set('isNew', 'true')
      params.set('sort', sort)
      params.set('limit', '100')

      const res = await fetch(`/api/products?${params}`)
      const data = await res.json()

      let result: Product[] = data.products ?? []

      // Client-side filtering for multi-value filters and rating
      if (filters.categories.length > 1) {
        result = result.filter((p) => filters.categories.includes(p.category.slug))
      }
      if (filters.brands.length > 1) {
        result = result.filter((p) => filters.brands.includes(p.brand))
      }
      if (filters.minRating > 0) {
        result = result.filter((p) => p.rating >= filters.minRating)
      }
      if (filters.inStock) {
        result = result.filter((p) => p.stock > 0)
      }

      setProducts(result)
      setTotal(result.length)
    } catch {
      setProducts([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [filters, sort, maxPrice])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleRemoveFilter = (key: keyof FilterState, value?: string) => {
    if (key === 'categories' && value) {
      setFilters((f) => ({ ...f, categories: f.categories.filter((c) => c !== value) }))
    } else if (key === 'brands' && value) {
      setFilters((f) => ({ ...f, brands: f.brands.filter((b) => b !== value) }))
    } else if (key === 'inStock') {
      setFilters((f) => ({ ...f, inStock: false }))
    } else if (key === 'isOnSale') {
      setFilters((f) => ({ ...f, isOnSale: false }))
    } else if (key === 'isNew') {
      setFilters((f) => ({ ...f, isNew: false }))
    } else if (key === 'minRating') {
      setFilters((f) => ({ ...f, minRating: 0 }))
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">All Products</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Computer hardware, peripherals, and accessories
        </p>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <ProductFilters
            filters={filters}
            onChange={setFilters}
            categories={categories}
            brands={brands}
            maxPrice={maxPrice}
          />
        </aside>

        {/* Mobile filters sheet */}
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetContent side="left" className="w-72 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <ProductFilters
                filters={filters}
                onChange={setFilters}
                categories={categories}
                brands={brands}
                maxPrice={maxPrice}
              />
            </div>
          </SheetContent>
        </Sheet>

        {/* Products area */}
        <div className="flex-1 min-w-0">
          <FilterBar
            total={total}
            sort={sort}
            onSortChange={setSort}
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
            onOpenFilters={() => setMobileFiltersOpen(true)}
          />
          {loading ? (
            <div className="py-20 text-center text-muted-foreground text-sm">Loading products…</div>
          ) : (
            <ProductGrid products={products} columns={3} />
          )}
        </div>
      </div>
    </div>
  )
}
