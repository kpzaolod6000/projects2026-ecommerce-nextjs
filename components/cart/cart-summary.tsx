import Link from 'next/link'
import { Cart } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Shield, Truck, RotateCcw } from 'lucide-react'

interface CartSummaryProps {
  cart: Cart
}

export function CartSummary({ cart }: CartSummaryProps) {
  const { subtotal, shipping, tax, total } = cart

  return (
    <div className="rounded-xl border border-border bg-surface p-6 space-y-4 sticky top-24">
      <h2 className="text-lg font-semibold text-foreground">Order Summary</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
            {shipping === 0 ? 'FREE' : formatPrice(shipping)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Estimated Tax</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between text-base font-bold">
        <span>Total</span>
        <span className="text-primary text-lg">{formatPrice(total)}</span>
      </div>

      {shipping === 0 && (
        <p className="text-xs text-green-600 text-center">
          You qualify for free shipping!
        </p>
      )}

      <Link href="/checkout" className="block">
        <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-11">
          Proceed to Checkout
        </Button>
      </Link>

      <Link href="/products" className="block">
        <Button variant="outline" className="w-full">
          Continue Shopping
        </Button>
      </Link>

      {/* Trust badges */}
      <div className="space-y-2 pt-2">
        {[
          { icon: Shield, text: 'Secure checkout with SSL encryption' },
          { icon: Truck, text: 'Free shipping on orders over $99' },
          { icon: RotateCcw, text: '30-day hassle-free returns' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
            {text}
          </div>
        ))}
      </div>
    </div>
  )
}
