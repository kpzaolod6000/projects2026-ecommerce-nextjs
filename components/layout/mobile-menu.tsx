'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { categories } from '@/lib/mock-data'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'All Products' },
  { href: '/products?sort=newest', label: 'New Arrivals' },
  { href: '/products?isOnSale=true', label: 'Deals' },
]

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-left text-primary font-bold text-xl">TechStore</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto">
          <nav className="p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Navigation
            </p>
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  {link.label}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </nav>

          <Separator />

          <nav className="p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Categories
            </p>
            <div className="space-y-1">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  {cat.name}
                  <span className="text-xs text-muted-foreground">
                    {cat._count?.products ?? 0}
                  </span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
