'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCartStore, computeCartTotals } from '@/lib/stores/cart-store'
import { CartItem } from '@/components/cart/cart-item'
import { CartSummary } from '@/components/cart/cart-summary'
import { Button } from '@/components/ui/button'

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore()

  const handleQuantityChange = (id: string, qty: number) => {
    updateQuantity(id, qty)
  }

  const handleRemove = (id: string) => {
    removeItem(id)
  }

  const cart = {
    items,
    ...computeCartTotals(items),
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-muted-foreground/40" />
        <h1 className="mb-2 text-2xl font-bold text-foreground">Your cart is empty</h1>
        <p className="mb-8 text-muted-foreground">
          Add some products to get started.
        </p>
        <Link href="/products">
          <Button className="bg-primary hover:bg-primary/90 text-white">
            Start Shopping
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-foreground sm:text-3xl">
        Shopping Cart
        <span className="ml-2 text-lg font-normal text-muted-foreground">
          ({items.length} {items.length === 1 ? 'item' : 'items'})
        </span>
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-white p-4">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </div>

        {/* Summary */}
        <div>
          <CartSummary cart={cart} />
        </div>
      </div>
    </div>
  )
}
