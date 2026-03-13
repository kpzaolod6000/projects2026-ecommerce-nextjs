import Link from 'next/link'
import { Package, Heart, MapPin, UserCircle2 } from 'lucide-react'
import { auth } from '@/auth'
import { AuthForms } from '@/components/account/auth-forms'
import { SignOutButton } from '@/components/account/sign-out-button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const session = await auth()
  const { callbackUrl } = await searchParams

  if (!session?.user) {
    return <AuthForms callbackUrl={callbackUrl} />
  }

  const user = session.user
  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : (user.email?.[0].toUpperCase() ?? 'U')

  const quickLinks = [
    { href: '/account/orders', icon: Package, label: 'My Orders', description: 'View order history' },
    { href: '/account/wishlist', icon: Heart, label: 'Wishlist', description: 'Saved products' },
    { href: '/account/addresses', icon: MapPin, label: 'Addresses', description: 'Shipping addresses' },
  ]

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      {/* Profile header */}
      <div className="flex items-center gap-5 mb-8">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.image ?? undefined} alt={user.name ?? ''} />
          <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-foreground truncate">{user.name ?? 'User'}</h1>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
            <span className="mt-1 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {user.role}
            </span>
          )}
        </div>
        <SignOutButton />
      </div>

      <Separator className="mb-8" />

      {/* Quick links */}
      <div className="grid gap-3 sm:grid-cols-3">
        {quickLinks.map(({ href, icon: Icon, label, description }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary hover:bg-primary/5"
          >
            <Icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
            <div>
              <p className="font-semibold text-foreground text-sm">{label}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Admin shortcut */}
      {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
        <div className="mt-6">
          <Separator className="mb-6" />
          <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 px-5 py-4">
            <div>
              <p className="font-semibold text-foreground text-sm">Admin Dashboard</p>
              <p className="text-xs text-muted-foreground">Manage products, orders and users</p>
            </div>
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-white">
              <Link href="/admin">Go to Admin</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Account info */}
      <div className="mt-6">
        <Separator className="mb-6" />
        <div className="flex items-center gap-3">
          <UserCircle2 className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Account ID</p>
            <p className="text-xs text-muted-foreground font-mono">{user.id}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
