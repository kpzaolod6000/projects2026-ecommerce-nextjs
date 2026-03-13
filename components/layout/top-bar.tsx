import { Phone, Truck, Globe } from 'lucide-react'

export function TopBar() {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs">
        <div className="flex items-center gap-4">
          <a href="tel:+18001234567" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
            <Phone className="h-3 w-3" />
            <span>1-800-123-4567</span>
          </a>
          <span className="hidden sm:flex items-center gap-1">
            <Truck className="h-3 w-3" />
            Free shipping on orders over $99
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block">30-Day Returns</span>
          <span>|</span>
          <button className="flex items-center gap-1 hover:opacity-80 transition-opacity">
            <Globe className="h-3 w-3" />
            <span>EN</span>
          </button>
        </div>
      </div>
    </div>
  )
}
