'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const slides = [
  {
    id: 1,
    tag: 'New Arrivals 2026',
    title: 'Next-Gen',
    highlight: 'Gaming PCs',
    subtitle: 'RTX 4090 · Core i9 · 64GB DDR5 — dominate every game at 4K.',
    cta: { label: 'Shop Desktops', href: '/categories/desktop-pcs' },
    secondary: { label: 'View Deals', href: '/products?isOnSale=true' },
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=1400&h=500&fit=crop',
    accent: 'from-gray-950 via-gray-950/75',
  },
  {
    id: 2,
    tag: 'Ultra-Clear Vision',
    title: 'QHD · 165Hz',
    highlight: 'Monitors',
    subtitle: 'IPS Black, G-Sync, 1ms response — see every detail in vivid color.',
    cta: { label: 'Shop Monitors', href: '/categories/monitors' },
    secondary: { label: 'Compare Models', href: '/products' },
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1400&h=500&fit=crop',
    accent: 'from-blue-950 via-blue-950/75',
  },
  {
    id: 3,
    tag: 'The Perfect Setup',
    title: 'Keyboards · Mice',
    highlight: '& More',
    subtitle: 'Mechanical switches, wireless freedom, RGB lighting — your setup, perfected.',
    cta: { label: 'Shop Peripherals', href: '/categories/keyboards' },
    secondary: { label: 'New Arrivals', href: '/products?sort=newest' },
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1400&h=500&fit=crop',
    accent: 'from-slate-950 via-slate-950/75',
  },
]

export function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const prev = useCallback(() => setCurrent((i) => (i === 0 ? slides.length - 1 : i - 1)), [])
  const next = useCallback(() => setCurrent((i) => (i === slides.length - 1 ? 0 : i + 1)), [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [paused, next])

  const slide = slides[current]

  return (
    <section
      className="relative overflow-hidden bg-gray-950 text-white select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <div className="relative h-56 sm:h-72 md:h-80">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={cn(
              'absolute inset-0 transition-opacity duration-700',
              i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
          >
            <Image
              src={s.image}
              alt={s.title}
              fill
              priority={i === 0}
              className="object-cover opacity-40"
            />
            <div className={cn('absolute inset-0 bg-gradient-to-r', s.accent, 'to-transparent')} />
          </div>
        ))}

        {/* Content */}
        <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6">
          <div className="max-w-md">
            <span className="mb-2 inline-block rounded-full bg-primary/90 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide">
              {slide.tag}
            </span>
            <h1 className="mb-1.5 text-2xl font-extrabold leading-tight sm:text-3xl md:text-4xl">
              {slide.title}{' '}
              <span className="text-primary">{slide.highlight}</span>
            </h1>
            <p className="mb-4 text-xs leading-relaxed text-gray-300 sm:text-sm line-clamp-2">
              {slide.subtitle}
            </p>
            <div className="flex gap-2">
              <Link href={slide.cta.href}>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs sm:text-sm">
                  {slide.cta.label}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link href={slide.secondary.href}>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10 text-xs sm:text-sm"
                >
                  {slide.secondary.label}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-1.5 bg-gray-950/80 py-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              'rounded-full transition-all duration-300',
              i === current
                ? 'w-5 h-1.5 bg-primary'
                : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
            )}
          />
        ))}
      </div>
    </section>
  )
}
