'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const clearQuery = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-xl">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products, brands..."
        className="pl-9 pr-16 h-10"
      />
      {query && (
        <button
          type="button"
          onClick={clearQuery}
          className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <Button
        type="submit"
        size="sm"
        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Go
      </Button>
    </form>
  )
}
