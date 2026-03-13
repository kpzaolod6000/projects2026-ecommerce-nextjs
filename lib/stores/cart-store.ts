import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product, ProductVariant } from '@/types'

interface CartState {
  items: CartItem[]
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  mergeWithDB: () => Promise<void>
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, variant) => {
        set((state) => {
          const key = variant ? `${product.id}-${variant.id}` : product.id
          const existing = state.items.find((i) =>
            variant ? i.id === key : i.productId === product.id && !i.variantId
          )

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === existing.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            }
          }

          const newItem: CartItem = {
            id: key,
            product,
            productId: product.id,
            quantity,
            variantId: variant?.id,
            variant,
          }
          return { items: [...state.items, newItem] }
        })
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }))
      },

      clearCart: () => set({ items: [] }),

      mergeWithDB: async () => {
        const { items, clearCart } = get()
        if (items.length === 0) return

        try {
          await Promise.all(
            items.map((item) =>
              fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  productId: item.productId,
                  variantId: item.variantId ?? null,
                  quantity: item.quantity,
                }),
              })
            )
          )
          clearCart()
        } catch (err) {
          console.error('Failed to merge cart with DB:', err)
        }
      },
    }),
    {
      name: 'techstore-cart',
    }
  )
)

export function computeCartTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = subtotal >= 99 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax
  return { subtotal, shipping, tax, total }
}
