import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const footerLinks = {
  Products: [
    { href: '/categories/desktop-pcs', label: 'Desktop PCs' },
    { href: '/categories/laptops', label: 'Laptops' },
    { href: '/categories/monitors', label: 'Monitors' },
    { href: '/categories/keyboards', label: 'Keyboards' },
    { href: '/categories/mice', label: 'Mice' },
  ],
  Support: [
    { href: '#', label: 'FAQ' },
    { href: '#', label: 'Shipping Policy' },
    { href: '#', label: 'Return Policy' },
    { href: '#', label: 'Warranty' },
    { href: '#', label: 'Contact Us' },
  ],
  Company: [
    { href: '#', label: 'About Us' },
    { href: '#', label: 'Blog' },
    { href: '#', label: 'Careers' },
    { href: '#', label: 'Press' },
    { href: '#', label: 'Affiliates' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-bold text-white">
              TechStore
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              Your trusted source for premium computer hardware. From gaming setups to professional workstations, we have everything you need.
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <a href="tel:+18001234567" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="h-4 w-4 text-primary" />
                1-800-123-4567
              </a>
              <a href="mailto:support@techstore.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="h-4 w-4 text-primary" />
                support@techstore.com
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span>123 Tech Ave, San Francisco, CA 94105</span>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-gray-400 hover:bg-primary hover:text-white transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <Separator className="my-8 bg-gray-700" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Subscribe to our newsletter</h3>
            <p className="text-xs text-gray-400">Get the latest deals and product updates.</p>
          </div>
          <form className="flex gap-2 max-w-sm w-full">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-primary"
            />
            <Button className="bg-primary hover:bg-primary/90 text-white flex-shrink-0">
              Subscribe
            </Button>
          </form>
        </div>

        <Separator className="my-8 bg-gray-700" />
        <div className="flex flex-col items-center justify-between gap-3 text-xs text-gray-500 sm:flex-row">
          <p>© 2026 TechStore. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
