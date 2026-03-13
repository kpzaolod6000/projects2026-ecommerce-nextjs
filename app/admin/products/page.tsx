'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Filter,
  Download,
  MoreHorizontal,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

type SortField = 'name' | 'price' | 'stock' | 'rating'
type SortDir = 'asc' | 'desc'

const stockBadge = (stock: number) => {
  if (stock === 0) return <Badge variant="destructive" className="text-[10px]">Out of Stock</Badge>
  if (stock <= 10) return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400 text-[10px] border-0">Low Stock ({stock})</Badge>
  return <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 text-[10px] border-0">In Stock ({stock})</Badge>
}

export default function AdminProductsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (status !== 'all') params.set('status', status)
      params.set('limit', '100')

      const res = await fetch(`/api/admin/products?${params}`)
      const data = await res.json()
      let list: Product[] = data.products ?? []

      // Client-side sort
      list = [...list].sort((a, b) => {
        const av = sortField === 'name' ? a.name : sortField === 'price' ? a.price : sortField === 'stock' ? a.stock : a.rating
        const bv = sortField === 'name' ? b.name : sortField === 'price' ? b.price : sortField === 'stock' ? b.stock : b.rating
        if (av < bv) return sortDir === 'asc' ? -1 : 1
        if (av > bv) return sortDir === 'asc' ? 1 : -1
        return 0
      })

      setProducts(list)
      setTotal(data.total ?? list.length)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [search, status, sortField, sortDir])

  useEffect(() => {
    const t = setTimeout(fetchProducts, 300)
    return () => clearTimeout(t)
  }, [fetchProducts])

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortField(field); setSortDir('asc') }
  }

  const toggleAll = () => {
    if (selected.size === products.length) setSelected(new Set())
    else setSelected(new Set(products.map((p) => p.id)))
  }

  const toggleOne = (id: string) => {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    if (res.ok) fetchProducts()
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} product(s)?`)) return
    await Promise.all([...selected].map((id) => fetch(`/api/admin/products/${id}`, { method: 'DELETE' })))
    setSelected(new Set())
    fetchProducts()
  }

  const SortIcon = ({ field }: { field: SortField }) => (
    sortField === field
      ? sortDir === 'asc'
        ? <ChevronUp className="h-3 w-3" />
        : <ChevronDown className="h-3 w-3" />
      : <ChevronUp className="h-3 w-3 opacity-20" />
  )

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">{total} total products</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
          <Link href="/admin/products/new">
            <Button size="sm" className="gap-1.5 bg-primary hover:bg-primary/90 text-white">
              <Plus className="h-3.5 w-3.5" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by name or brand…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44 h-9 text-sm">
            <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-sm">All Statuses</SelectItem>
            <SelectItem value="ACTIVE" className="text-sm">Active</SelectItem>
            <SelectItem value="DRAFT" className="text-sm">Draft</SelectItem>
            <SelectItem value="ARCHIVED" className="text-sm">Archived</SelectItem>
          </SelectContent>
        </Select>
        {selected.size > 0 && (
          <Button variant="destructive" size="sm" className="gap-1.5 h-9" onClick={handleBulkDelete}>
            <Trash2 className="h-3.5 w-3.5" /> Delete ({selected.size})
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm text-muted-foreground">Loading products…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="w-10 px-4 py-3">
                    <Checkbox
                      checked={selected.size === products.length && products.length > 0}
                      onCheckedChange={toggleAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground hidden md:table-cell">Category</th>
                  <th
                    className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground cursor-pointer select-none"
                    onClick={() => toggleSort('price')}
                  >
                    <span className="flex items-center justify-end gap-1">Price <SortIcon field="price" /></span>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground cursor-pointer select-none hidden sm:table-cell"
                    onClick={() => toggleSort('stock')}
                  >
                    <span className="flex items-center gap-1">Stock <SortIcon field="stock" /></span>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground cursor-pointer select-none hidden lg:table-cell"
                    onClick={() => toggleSort('rating')}
                  >
                    <span className="flex items-center gap-1">Rating <SortIcon field="rating" /></span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground hidden md:table-cell">Status</th>
                  <th className="w-10 px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const img = product.images.find((i) => i.isPrimary) ?? product.images[0]
                  return (
                    <tr
                      key={product.id}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={selected.has(product.id)}
                          onCheckedChange={() => toggleOne(product.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                            {img && (
                              <Image
                                src={img.url}
                                alt={product.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-foreground line-clamp-1">{product.name}</p>
                            <p className="text-[10px] text-muted-foreground">{product.brand} · {product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <Badge variant="outline" className="text-[10px] font-medium">{product.category.name}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div>
                          <p className="text-xs font-semibold text-foreground">{formatPrice(product.price)}</p>
                          {product.comparePrice && (
                            <p className="text-[10px] text-muted-foreground line-through">{formatPrice(product.comparePrice)}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">{stockBadge(product.stock)}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-muted-foreground">⭐ {product.rating} ({product.reviewCount})</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <Badge
                          className={
                            product.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 text-[10px] border-0'
                              : 'text-[10px]'
                          }
                        >
                          {product.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem className="text-xs gap-2" asChild>
                              <Link href={`/admin/products/${product.id}/edit`}>
                                <Pencil className="h-3.5 w-3.5" /> Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-xs gap-2 text-red-600 focus:text-red-600"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No products match your search.
          </div>
        )}

        {/* Pagination (UI only) */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Showing <strong>{products.length}</strong> of <strong>{total}</strong> products
          </p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-7 px-3 text-xs" disabled>Prev</Button>
            <Button variant="outline" size="sm" className="h-7 px-3 text-xs bg-primary/10 text-primary border-primary/30">1</Button>
            <Button variant="outline" size="sm" className="h-7 px-3 text-xs" disabled>Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
