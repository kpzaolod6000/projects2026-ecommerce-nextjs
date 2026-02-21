# Plan: Ecommerce UI — Computer Hardware Store

## Contexto
Proyecto ecommerce de productos de computación (PCs, Monitores, Teclados, Mouse, etc.).
**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · Prisma (solo schema).
**Fase 1:** Solo diseño de UI con datos mock — sin lógica de backend ni API routes.
**Referencia visual:** Shopcart — top bar verde oscuro, hero banner, grid 4 columnas, filtros laterales.

---

## Phase 1 — Bootstrap del proyecto

### Comandos (en orden estricto)

```bash
cd /home/judal/ecommerce-basic

# 1. Crear app Next.js 15
npx create-next-app@latest . --typescript --tailwind --eslint --app --import-alias "@/*"
# (no --src-dir · Turbopack: yes)

# 2. Prisma
npm install prisma --save-dev && npm install @prisma/client
npx prisma init --datasource-provider postgresql

# 3. shadcn/ui
npx shadcn@latest init
# Style: Default | Base color: Slate | CSS variables: Yes

# 4. Instalar componentes shadcn
npx shadcn@latest add button card badge input label select sheet tabs \
  separator avatar dropdown-menu skeleton checkbox slider breadcrumb \
  scroll-area dialog drawer

# 5. Dependencias adicionales
npm install lucide-react
```

---

## Phase 2 — Design Tokens (`app/globals.css`)

Color scheme extraído de la referencia visual:

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-primary` | `#1a5c3a` | Botones CTA, top bar, links activos |
| `--color-primary-dark` | `#134a2e` | Hover en primary |
| `--color-primary-light` | `#2d7a52` | Highlights sutiles |
| `--color-background` | `#ffffff` | Fondo de página |
| `--color-surface` | `#f9fafb` | Interior de cards, inputs |
| `--color-border` | `#e5e7eb` | Bordes de cards e inputs |
| `--color-muted` | `#6b7280` | Textos secundarios |
| `--color-foreground` | `#111827` | Texto principal |
| `--color-star` | `#f59e0b` | Estrellas de rating |
| `--color-success` | `#16a34a` | En stock, descuentos |
| `--color-destructive` | `#dc2626` | Fuera de stock, errores |

Configuración en `app/globals.css` usando `@theme` (Tailwind v4) + `:root` HSL para shadcn/ui.

```css
@import "tailwindcss";

@theme {
  --color-primary:       #1a5c3a;
  --color-primary-dark:  #134a2e;
  --color-primary-light: #2d7a52;
  --color-primary-fg:    #ffffff;
  --color-background:    #ffffff;
  --color-surface:       #f9fafb;
  --color-border:        #e5e7eb;
  --color-muted:         #6b7280;
  --color-foreground:    #111827;
  --color-star:          #f59e0b;
  --color-success:       #16a34a;
  --color-destructive:   #dc2626;
  --font-sans:           var(--font-inter);
}

@layer base {
  :root {
    --primary:            152 55% 23%;
    --primary-foreground: 0 0% 100%;
    --background:         0 0% 100%;
    --foreground:         222.2 84% 4.9%;
    --muted:              220 14.3% 95.9%;
    --muted-foreground:   220 8.9% 46.1%;
    --border:             220 13% 91%;
    --ring:               152 55% 23%;
    --radius:             0.5rem;
  }
}
```

---

## Phase 3 — Archivos de soporte

| # | Archivo | Descripción |
|---|---------|-------------|
| 1 | `types/index.ts` | Interfaces: `Product`, `Category`, `CartItem`, `Cart`, `FilterState`, `SortOption` |
| 2 | `lib/utils.ts` | `cn()`, `formatPrice()`, `getDiscountPercent()`, `slugify()` |
| 3 | `lib/mock-data.ts` | 10 categorías + 20 productos completos + helpers |
| 4 | `prisma/schema.prisma` | Schema completo (sin migrar aún) |
| 5 | `next.config.ts` | `images.remotePatterns` para Unsplash y picsum |

### Categorías de productos
PCs · Monitores · Teclados · Mouse · Headsets · Speakers · Webcams · Storage · RAM · GPU

### Modelos Prisma (schema.prisma)
```
User
Category       (auto-referencial parentId para subcategorías)
Product        (specs: Json, tags/colors: String[])
ProductImage
CartItem       (unique [userId, productId])
Wishlist
Address
Order
OrderItem      (priceAtTime: snapshot del precio en compra)
```

**Decisiones clave del schema:**
- `Product.specs` → `Json` — specs radicalmente distintas por categoría (CPU vs Monitor vs Teclado)
- `CartItem` unique en `[userId, productId]` — evita duplicados en carrito
- `OrderItem.priceAtTime` — snapshot para que cambios de precio no alteren pedidos históricos
- Indexes en: `slug`, `categoryId`, `isFeatured`, `isOnSale`, `status`

---

## Phase 4 — Componentes

### Orden de construcción (por dependencias)

#### Capa 1 — Primitivos
| Archivo | Server/Client | Función |
|---------|--------------|---------|
| `components/ui/price-display.tsx` | Server | Precio + tachado + % descuento |
| `components/product/star-rating.tsx` | Server | 5 estrellas con decimales |
| `components/product/product-badge.tsx` | Server | New / Sale / Hot / Out-of-stock |
| `components/product/wishlist-button.tsx` | `'use client'` | Corazón toggle (useState) |

#### Capa 2 — Product Card + Grid
| Archivo | Server/Client | Función |
|---------|--------------|---------|
| `components/product/product-card.tsx` | Server | Imagen, nombre, precio, stars, Add to Cart |
| `components/product/product-grid.tsx` | Server | Grid 2/3/4 cols + Skeleton loading |

#### Capa 3 — Filtros y ordenamiento
| Archivo | Server/Client | Función |
|---------|--------------|---------|
| `components/product/product-filters.tsx` | `'use client'` | Checkboxes categoría/marca, Slider precio, rating |
| `components/sections/filter-bar.tsx` | `'use client'` | Sort Select + chips de filtros activos |

#### Capa 4 — Layout
| Archivo | Server/Client | Función |
|---------|--------------|---------|
| `components/layout/top-bar.tsx` | Server | Barra verde: teléfono, promo, idioma/ubicación |
| `components/layout/search-bar.tsx` | `'use client'` | Input + router.push a `/search` |
| `components/layout/mobile-menu.tsx` | `'use client'` | Sheet lateral con nav + categorías |
| `components/layout/navbar.tsx` | Server | Logo, nav links, SearchBar, iconos, hamburger |
| `components/layout/footer.tsx` | Server | Links, newsletter, copyright |

#### Capa 5 — Secciones homepage
| Archivo | Server/Client | Función |
|---------|--------------|---------|
| `components/sections/hero-banner.tsx` | Server | Imagen de fondo, título, subtítulo, CTA |
| `components/sections/category-grid.tsx` | Server | Grid 5 col con imagen circular por categoría |
| `components/sections/featured-products.tsx` | Server | Título + "Ver todo" + ProductGrid |

#### Capa 6 — Carrito
| Archivo | Server/Client | Función |
|---------|--------------|---------|
| `components/cart/cart-item.tsx` | `'use client'` | Imagen, nombre, qty +/-, botón eliminar |
| `components/cart/cart-summary.tsx` | Server | Subtotal, envío, tax, total, btn checkout |

#### Capa 7 — Detalle de producto
| Archivo | Server/Client | Función |
|---------|--------------|---------|
| `components/product/product-images.tsx` | `'use client'` | Imagen principal + thumbnails seleccionables |
| `components/product/product-info.tsx` | `'use client'` | Nombre, precio, specs table, qty, Add to Cart |

---

## Phase 5 — Páginas

| Ruta | Archivo | Tipo | Descripción |
|------|---------|------|-------------|
| `/` | `app/page.tsx` | Server | HeroBanner + CategoryGrid + FeaturedProducts |
| `/products` | `app/products/page.tsx` | `'use client'` | Filtros + sort state + ProductGrid |
| `/products/[slug]` | `app/products/[slug]/page.tsx` | `async` | Galería + info + productos relacionados |
| `/cart` | `app/cart/page.tsx` | `'use client'` | Estado del carrito mock |
| `/checkout` | `app/checkout/page.tsx` | `'use client'` | Formulario: contacto + dirección + pago (Tabs) |
| `/account` | `app/account/page.tsx` | `'use client'` | Tabs: Sign In / Create Account |
| `/categories/[slug]` | `app/categories/[slug]/page.tsx` | `async` | Productos filtrados por categoría |
| `/search` | `app/search/page.tsx` | Suspense | Resultados filtrados del mock data |
| Layout | `app/layout.tsx` | Server | TopBar + Navbar + `{children}` + Footer |

### Patrones críticos de Next.js 15

**params es una Promise** en rutas dinámicas:
```tsx
// CORRECTO
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
}
```

**useSearchParams requiere Suspense:**
```tsx
export default function SearchPage() {
  return (
    <Suspense fallback={<div>Buscando...</div>}>
      <SearchResults /> {/* componente con useSearchParams() */}
    </Suspense>
  )
}
```

---

## Phase 6 — Configuración adicional

**`next.config.ts`** — permitir imágenes externas para mock data:
```ts
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
}
export default nextConfig
```

**`public/images/placeholder.png`** — imagen fallback para productos sin imagen.

---

## Estructura final de carpetas

```
ecommerce-basic/
├── app/
│   ├── globals.css                    ← tokens @theme + :root HSL shadcn
│   ├── layout.tsx                     ← TopBar + Navbar + Footer
│   ├── page.tsx                       ← Homepage
│   ├── products/
│   │   ├── page.tsx                   ← Listado con filtros
│   │   └── [slug]/page.tsx            ← Detalle de producto
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── account/page.tsx
│   ├── categories/[slug]/page.tsx
│   └── search/page.tsx
├── components/
│   ├── layout/
│   │   ├── top-bar.tsx
│   │   ├── navbar.tsx
│   │   ├── search-bar.tsx
│   │   ├── footer.tsx
│   │   └── mobile-menu.tsx
│   ├── product/
│   │   ├── product-card.tsx           ← componente más reutilizado
│   │   ├── product-grid.tsx
│   │   ├── product-filters.tsx
│   │   ├── product-images.tsx
│   │   ├── product-info.tsx
│   │   ├── product-badge.tsx
│   │   ├── star-rating.tsx
│   │   └── wishlist-button.tsx
│   ├── cart/
│   │   ├── cart-item.tsx
│   │   └── cart-summary.tsx
│   ├── sections/
│   │   ├── hero-banner.tsx
│   │   ├── category-grid.tsx
│   │   ├── featured-products.tsx
│   │   └── filter-bar.tsx
│   └── ui/
│       ├── price-display.tsx          ← custom
│       └── [shadcn generados...]
├── lib/
│   ├── utils.ts                       ← cn, formatPrice, helpers
│   └── mock-data.ts                   ← 20 productos, 10 categorías + helpers
├── types/
│   └── index.ts                       ← todas las interfaces TypeScript
├── prisma/
│   └── schema.prisma                  ← schema completo (sin migrar)
├── public/images/placeholder.png
├── next.config.ts
├── components.json                    ← shadcn config
└── docs/
    └── plan.md                        ← este archivo
```

---

## Checklist de verificación (al finalizar)

- [ ] `npm run dev` → sin errores de compilación
- [ ] `/` → TopBar verde + Navbar + Hero + Categorías + Productos destacados
- [ ] `/products` → Grid 4 col con filtros laterales y sort funcional
- [ ] `/products/[slug]` → galería + specs + qty + Add to Cart
- [ ] `/cart` → items con qty editable, total calculado dinámicamente
- [ ] `/checkout` → formulario completo con Tabs de pago
- [ ] `/account` → Tabs Login/Register funcionales (UI only)
- [ ] `/categories/[slug]` → productos filtrados por categoría
- [ ] `/search?q=gaming` → resultados filtrados del mock data
- [ ] Responsive → navbar colapsa a hamburger en mobile (< 1024px)
- [ ] Imágenes → `next/image` con `remotePatterns` configurado
