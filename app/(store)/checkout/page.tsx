'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CreditCard, Building2, Lock, CheckCircle2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCartStore, computeCartTotals } from '@/lib/stores/cart-store'

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
})

const shippingSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(4, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
})

type ContactForm = z.infer<typeof contactSchema>
type ShippingForm = z.infer<typeof shippingSchema>

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore()
  const [step, setStep] = useState<'contact' | 'shipping' | 'payment'>('contact')
  const [completed, setCompleted] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card')

  const { subtotal, shipping, tax, total } = computeCartTotals(items)

  const contactForm = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  })

  const shippingForm = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
  })

  const onContactSubmit = () => {
    setStep('shipping')
  }

  const onShippingSubmit = () => {
    setStep('payment')
  }

  const handlePlaceOrder = () => {
    const num = `TS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`
    setOrderNumber(num)
    clearCart()
    setCompleted(true)
  }

  if (completed) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
        <h1 className="mb-2 text-2xl font-bold text-foreground">Order Confirmed!</h1>
        <p className="mb-2 text-muted-foreground">
          Thank you for your purchase. Your order {orderNumber} has been placed.
        </p>
        <p className="mb-8 text-sm text-muted-foreground">
          A confirmation email has been sent to your email address.
        </p>
        <Button
          className="bg-primary hover:bg-primary/90 text-white"
          onClick={() => (window.location.href = '/')}
        >
          Continue Shopping
        </Button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="mb-4 text-2xl font-bold text-foreground">Your cart is empty</h1>
        <Button className="bg-primary hover:bg-primary/90 text-white" onClick={() => (window.location.href = '/products')}>
          Shop Now
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-foreground sm:text-3xl">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left — Form */}
        <div className="lg:col-span-2">
          <Tabs value={step} onValueChange={(v) => setStep(v as typeof step)}>
            <TabsList className="mb-6 w-full justify-start gap-2 bg-transparent p-0 border-b border-border rounded-none">
              {(['contact', 'shipping', 'payment'] as const).map((s) => (
                <TabsTrigger
                  key={s}
                  value={s}
                  className="capitalize rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary pb-3"
                >
                  {s === 'contact' ? '1. Contact' : s === 'shipping' ? '2. Shipping' : '3. Payment'}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Contact */}
            <TabsContent value="contact">
              <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" {...contactForm.register('firstName')} />
                    {contactForm.formState.errors.firstName && (
                      <p className="text-xs text-red-500">{contactForm.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" {...contactForm.register('lastName')} />
                    {contactForm.formState.errors.lastName && (
                      <p className="text-xs text-red-500">{contactForm.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" {...contactForm.register('email')} />
                  {contactForm.formState.errors.email && (
                    <p className="text-xs text-red-500">{contactForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" {...contactForm.register('phone')} />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
                  Continue to Shipping
                </Button>
              </form>
            </TabsContent>

            {/* Shipping */}
            <TabsContent value="shipping">
              <form onSubmit={shippingForm.handleSubmit(onShippingSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="street">Street Address</Label>
                  <Input id="street" placeholder="123 Main St, Apt 4B" {...shippingForm.register('street')} />
                  {shippingForm.formState.errors.street && (
                    <p className="text-xs text-red-500">{shippingForm.formState.errors.street.message}</p>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="San Francisco" {...shippingForm.register('city')} />
                    {shippingForm.formState.errors.city && (
                      <p className="text-xs text-red-500">{shippingForm.formState.errors.city.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="state">State / Province</Label>
                    <Input id="state" placeholder="CA" {...shippingForm.register('state')} />
                    {shippingForm.formState.errors.state && (
                      <p className="text-xs text-red-500">{shippingForm.formState.errors.state.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" placeholder="94105" {...shippingForm.register('postalCode')} />
                    {shippingForm.formState.errors.postalCode && (
                      <p className="text-xs text-red-500">{shippingForm.formState.errors.postalCode.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="country">Country</Label>
                    <Select
                      defaultValue="us"
                      onValueChange={(v) => shippingForm.setValue('country', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Shipping method */}
                <div className="space-y-2 pt-2">
                  <Label className="text-sm font-medium">Shipping Method</Label>
                  {[
                    { id: 'standard', label: 'Standard Shipping (5-7 days)', price: 'FREE' },
                    { id: 'express', label: 'Express Shipping (2-3 days)', price: '$9.99' },
                    { id: 'overnight', label: 'Overnight Shipping (Next day)', price: '$24.99' },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className="flex cursor-pointer items-center justify-between rounded-lg border border-border p-3 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <input type="radio" name="shipping" defaultChecked={method.id === 'standard'} />
                        <span className="text-sm">{method.label}</span>
                      </div>
                      <span className={`text-sm font-medium ${method.price === 'FREE' ? 'text-green-600' : ''}`}>
                        {method.price}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep('contact')}>
                    Back
                  </Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-white">
                    Continue to Payment
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* Payment */}
            <TabsContent value="payment" className="space-y-4">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border text-muted-foreground hover:border-muted-foreground'
                  }`}
                >
                  <CreditCard className="h-4 w-4" /> Credit / Debit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-colors ${
                    paymentMethod === 'bank'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border text-muted-foreground hover:border-muted-foreground'
                  }`}
                >
                  <Building2 className="h-4 w-4" /> Bank Transfer
                </button>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cardName">Name on Card</Label>
                <Input id="cardName" placeholder="John Doe" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" maxLength={19} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM / YY" maxLength={7} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" maxLength={4} type="password" />
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5 flex-shrink-0 text-green-600" />
                Your payment information is encrypted and secure.
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep('shipping')}>
                  Back
                </Button>
                <Button
                  type="button"
                  className="flex-1 bg-primary hover:bg-primary/90 text-white h-11 font-semibold"
                  onClick={handlePlaceOrder}
                >
                  Place Order — {formatPrice(total)}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right — Order Summary */}
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground line-clamp-1 flex-1 pr-2">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-medium flex-shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                {shipping === 0 ? (
                  <span className="text-green-600 font-medium">FREE</span>
                ) : (
                  <span>{formatPrice(shipping)}</span>
                )}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
