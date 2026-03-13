import Link from 'next/link'
import { ShoppingCart, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/layout/search-bar'
import { MobileMenu } from '@/components/layout/mobile-menu'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { UserMenu } from '@/components/layout/user-menu'
import { auth } from '@/auth'

const navLinks = [
  { href: '/products', label: 'All Products' },
  { href: '/products?sort=newest', label: 'New Arrivals' },
  { href: '/products?isOnSale=true', label: 'Deals' },
  { href: '/categories/desktop-pcs', label: 'Desktops' },
  { href: '/categories/laptops', label: 'Laptops' },
]

export async function Navbar() {
  const session = await auth()
  const isAdmin =
    session?.user?.role === 'ADMIN' || session?.user?.role === 'MANAGER'

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <MobileMenu />

        <Link href="/" className="flex-shrink-0 text-xl font-bold text-primary">
          TechStore
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ml-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1 hidden sm:flex justify-center">
          <SearchBar />
        </div>

        <div className="flex items-center gap-1 ml-auto lg:ml-0">
          <ThemeToggle />
          {isAdmin && (
            <Link href="/admin" title="Admin dashboard">
              <Button variant="ghost" size="icon" aria-label="Admin dashboard">
                <LayoutDashboard className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <UserMenu user={session?.user} />
          <Link href="/cart">
            <Button variant="ghost" size="icon" aria-label="Cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                3
              </span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="sm:hidden px-4 pb-3">
        <SearchBar />
      </div>
    </header>
  )
}
