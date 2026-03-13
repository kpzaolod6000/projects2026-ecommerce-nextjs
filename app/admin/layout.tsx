'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  CreditCard,
  Users,
  Settings,
  Menu,
  X,
  Bell,
  ChevronRight,
  LogOut,
  Store,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package, badge: '20' },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard, badge: '3', badgeVariant: 'destructive' as const },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen w-60 flex-col border-r border-border bg-card transition-transform duration-300 lg:static lg:translate-x-0 lg:z-auto',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-primary text-lg" onClick={onClose}>
            <LayoutDashboard className="h-5 w-5" />
            TechAdmin
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          <p className="mb-2 mt-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Main
          </p>
          {navItems.map(({ href, label, icon: Icon, badge, badgeVariant, exact }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive(href, exact)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {badge && (
                <Badge
                  variant={isActive(href, exact) ? 'secondary' : (badgeVariant ?? 'secondary')}
                  className={cn(
                    'text-[10px] h-4 px-1.5',
                    isActive(href, exact) && 'bg-primary-foreground/20 text-primary-foreground'
                  )}
                >
                  {badge}
                </Badge>
              )}
            </Link>
          ))}

          <Separator className="my-3" />

          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Store className="h-4 w-4" />
            View Store
            <ChevronRight className="ml-auto h-3 w-3" />
          </Link>
        </nav>

        {/* User section */}
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-lg p-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">Admin User</p>
              <p className="text-[10px] text-muted-foreground truncate">admin@techstore.com</p>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-500">
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Breadcrumb label map
  const pageLabels: Record<string, string> = {
    '/admin': 'Overview',
    '/admin/products': 'Products',
    '/admin/payments': 'Payments',
    '/admin/users': 'Users',
    '/admin/settings': 'Settings',
  }
  const pageLabel = pageLabels[pathname] ?? 'Admin'

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-border bg-card px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <span>Admin</span>
              {pageLabel !== 'Overview' && (
                <>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span className="font-medium text-foreground">{pageLabel}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
