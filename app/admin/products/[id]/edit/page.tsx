'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Category, Product } from '@/types'

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  comparePrice: z.number().optional(),
  sku: z.string().min(1, 'SKU is required'),
  stock: z.number().int().min(0),
  brand: z.string().min(1, 'Brand is required'),
  categoryId: z.string().min(1, 'Category is required'),
  isFeatured: z.boolean(),
  isOnSale: z.boolean(),
  isNew: z.boolean(),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']),
  tags: z.string().optional(),
})

type ProductFormData = z.infer<typeof productSchema>

interface Props {
  params: Promise<{ id: string }>
}

export default function EditProductPage({ params }: Props) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState('')
  const [productId, setProductId] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  })

  useEffect(() => {
    params.then(({ id }) => {
      setProductId(id)
      return Promise.all([
        fetch(`/api/admin/products/${id}`).then((r) => r.json()),
        fetch('/api/categories').then((r) => r.json()),
      ])
    }).then(([productData, catData]) => {
      const p: Product = productData.product
      setProduct(p)
      setCategories(catData.categories ?? [])
      reset({
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        comparePrice: p.comparePrice,
        sku: p.sku,
        stock: p.stock,
        brand: p.brand,
        categoryId: p.categoryId,
        isFeatured: p.isFeatured,
        isOnSale: p.isOnSale,
        isNew: p.isNew,
        status: p.status,
        tags: p.tags?.join(', ') ?? '',
      })
    }).catch(() => setError('Failed to load product'))
  }, [params, reset])

  const onSubmit = async (data: ProductFormData) => {
    setError('')
    const payload = {
      ...data,
      tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      comparePrice: data.comparePrice || null,
    }

    const res = await fetch(`/api/admin/products/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      router.push('/admin/products')
    } else {
      const body = await res.json()
      setError(body.error ?? 'Failed to update product')
    }
  }

  if (!product && !error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">Loading product…</p>
      </div>
    )
  }

  if (error && !product) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link href="/admin/products">
          <Button variant="outline">Back to Products</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Edit Product</h1>
          <p className="text-sm text-muted-foreground line-clamp-1">{product?.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...register('slug')} />
              {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={4} {...register('description')} />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" {...register('brand')} />
                {errors.brand && <p className="text-xs text-red-500">{errors.brand.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" {...register('sku')} />
                {errors.sku && <p className="text-xs text-red-500">{errors.sku.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Category</Label>
              {product && (
                <Select
                  defaultValue={product.categoryId}
                  onValueChange={(v) => setValue('categoryId', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" {...register('tags')} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pricing & Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" type="number" step="0.01" {...register('price', { valueAsNumber: true })} />
                {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="comparePrice">Compare Price ($)</Label>
                <Input id="comparePrice" type="number" step="0.01" {...register('comparePrice', { valueAsNumber: true })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="number" {...register('stock', { valueAsNumber: true })} />
                {errors.stock && <p className="text-xs text-red-500">{errors.stock.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Status</Label>
              {product && (
                <Select
                  defaultValue={product.status}
                  onValueChange={(v) => setValue('status', v as 'ACTIVE' | 'DRAFT' | 'ARCHIVED')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="flex gap-6">
              {[
                { id: 'isFeatured', label: 'Featured', defaultValue: product?.isFeatured },
                { id: 'isOnSale', label: 'On Sale', defaultValue: product?.isOnSale },
                { id: 'isNew', label: 'New Arrival', defaultValue: product?.isNew },
              ].map(({ id, label, defaultValue }) => (
                <div key={id} className="flex items-center gap-2">
                  <Checkbox
                    id={id}
                    defaultChecked={defaultValue}
                    onCheckedChange={(v) => setValue(id as keyof ProductFormData, !!v as never)}
                  />
                  <Label htmlFor={id} className="cursor-pointer text-sm">{label}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <div className="flex gap-3">
          <Link href="/admin/products">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
