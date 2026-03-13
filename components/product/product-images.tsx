'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ProductImage } from '@/types'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProductImagesProps {
  images: ProductImage[]
  productName: string
}

export function ProductImages({ images, productName }: ProductImagesProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
        No image available
      </div>
    )
  }

  const prev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  const next = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50 border border-border group">
        <Image
          src={images[activeIndex].url}
          alt={images[activeIndex].alt ?? productName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity shadow"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity shadow"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === activeIndex ? 'w-4 bg-primary' : 'w-1.5 bg-white/70'
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={cn(
                'relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                i === activeIndex
                  ? 'border-primary shadow-sm'
                  : 'border-border hover:border-muted-foreground'
              )}
            >
              <Image
                src={img.url}
                alt={img.alt ?? `${productName} ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
