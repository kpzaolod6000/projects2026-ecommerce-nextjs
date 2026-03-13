'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Product } from '@/types'
import { ProductGrid } from '@/components/product/product-grid'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const router = useRouter()
  const [inputValue, setInputValue] = useState(query)
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setInputValue(query)
    if (!query.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((data) => setResults(data.products ?? []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Search box */}
      <form onSubmit={handleSearch} className="mb-8 flex gap-3 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search products..."
            className="pl-9"
          />
        </div>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
          Search
        </Button>
      </form>

      {query ? (
        <>
          <div className="mb-6">
            {loading ? (
              <p className="text-sm text-muted-foreground">Searching…</p>
            ) : (
              <h1 className="text-xl font-bold text-foreground sm:text-2xl">
                {results.length > 0 ? (
                  <>
                    <span className="text-muted-foreground font-normal text-base">
                      {results.length} results for{' '}
                    </span>
                    &ldquo;{query}&rdquo;
                  </>
                ) : (
                  `No results for "${query}"`
                )}
              </h1>
            )}
          </div>

          {!loading && results.length > 0 && (
            <ProductGrid products={results} columns={4} />
          )}

          {!loading && results.length === 0 && (
            <div className="py-16 text-center">
              <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
              <p className="mb-2 text-muted-foreground">
                We couldn&apos;t find anything matching &ldquo;{query}&rdquo;.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Try different keywords or browse our categories.
              </p>
              <Link href="/products" className="text-primary hover:underline text-sm font-medium">
                Browse all products →
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="py-16 text-center">
          <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="text-muted-foreground">Enter a search term to find products.</p>
        </div>
      )}
    </div>
  )
}
