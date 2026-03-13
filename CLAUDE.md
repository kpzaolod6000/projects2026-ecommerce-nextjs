# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# TechStore Ecommerce

## Stack

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Lenguaje | TypeScript strict |
| Estilos | Tailwind CSS v4 |
| Componentes | shadcn/ui v3 (Radix UI) |
| Iconos | lucide-react |
| Dark mode | next-themes (`attribute="class"`) |
| ORM | Prisma 7 (solo schema — sin migrar) |
| BD | PostgreSQL (no configurada aún) |
| Estado global | Zustand |
| Formularios | react-hook-form + zod |
| Package manager | **npm** (no usar bun ni pnpm) |

---

## Comandos

```bash
npm run dev      # servidor de desarrollo (Turbopack, puerto 3000)
npm run build    # build de producción + chequeo TypeScript
npm run lint     # ESLint
npx shadcn@latest add <componente>   # agregar componente shadcn
```

> Antes de marcar una tarea como terminada, correr `npm run build` para verificar que no hay errores de TypeScript ni compilación.

---

## Estructura de carpetas

```
app/
├── layout.tsx              ← Root layout: solo ThemeProvider + html/body
├── globals.css             ← Tokens Tailwind v4 (@theme inline) + variables HSL
├── (store)/                ← Route group — tienda pública
│   ├── layout.tsx          ← TopBar + Navbar + Footer
│   ├── page.tsx            ← Homepage
│   ├── products/
│   │   ├── page.tsx        ← Listado con filtros ('use client')
│   │   └── [slug]/page.tsx ← Detalle de producto (async, SSG)
│   ├── categories/[slug]/page.tsx
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── account/page.tsx
│   └── search/
│       ├── page.tsx        ← Wrapper con <Suspense>
│       └── search-results.tsx  ← useSearchParams aquí
└── admin/                  ← Dashboard de administración
    ├── layout.tsx          ← Sidebar + header (sin store chrome)
    ├── page.tsx            ← Overview / stats
    ├── products/page.tsx
    ├── payments/page.tsx
    └── users/page.tsx

components/
├── theme-provider.tsx      ← Wrapper next-themes ('use client')
├── layout/                 ← top-bar, navbar, footer, search-bar, mobile-menu, theme-toggle
├── product/                ← product-card, product-grid, product-filters, product-images,
│                              product-info, product-badge, star-rating, wishlist-button
├── cart/                   ← cart-item, cart-summary
├── sections/               ← hero-banner (carousel), category-grid, featured-products, filter-bar
└── ui/                     ← shadcn/ui + price-display (custom)

lib/
├── utils.ts                ← cn(), formatPrice(), getDiscountPercent(), slugify()
└── mock-data.ts            ← 20 productos, 10 categorías + helpers de filtrado/búsqueda

types/index.ts              ← Product, Category, CartItem, Cart, FilterState, SortOption, etc.
prisma/schema.prisma        ← Schema completo (User, Product, Category, Order, etc.)
```

---

## Convenciones de código

### Server vs Client components
- Por defecto, todos los componentes son **Server Components** (sin `'use client'`).
- Agregar `'use client'` solo cuando se usen: hooks de React (`useState`, `useEffect`, etc.), event handlers, `useRouter`, `useSearchParams`, o APIs del browser.
- Si un Server Component necesita interactividad puntual, extraer solo esa parte a un Client Component hijo.

### Next.js 15/16 — params como Promise
```tsx
// CORRECTO
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
}

// MAL — params ya no es un objeto directo
export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params  // ← Error en Next.js 15+
}
```

### useSearchParams requiere Suspense
```tsx
// page.tsx
export default function SearchPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SearchResults />  {/* ← useSearchParams() va aquí adentro */}
    </Suspense>
  )
}
```

### Manejo de estado y formularios
- **Estado global**: Zustand (stores en `lib/stores/` o `store/`)
- **Formularios**: react-hook-form + zod para validación de esquemas
- **No usar server actions** — toda mutación de datos va a través de **Route Handlers** (`app/api/`)
- **No usar modales para crear/editar datos** — usar páginas dedicadas con formularios

### Imports
```tsx
import { cn } from '@/lib/utils'              // utilidades
import { Button } from '@/components/ui/button' // shadcn
import { products } from '@/lib/mock-data'    // datos mock
import type { Product } from '@/types'        // tipos
```

---

## Diseño y estilos

### Color primario
- **Verde oscuro** `#1a5c3a` → `oklch(0.39 0.09 155)` en CSS
- Usar `bg-primary`, `text-primary`, `border-primary` (clases Tailwind que leen la variable CSS)
- Nunca hardcodear el hex directamente en los componentes

### Dark mode
- next-themes usa la clase `.dark` en `<html>`
- Usar variantes `dark:` de Tailwind: `dark:bg-gray-900`, `dark:text-white`, etc.
- Las variables CSS de shadcn (`--background`, `--foreground`, etc.) cambian automáticamente con `.dark`
- El `<html>` tiene `suppressHydrationWarning` para evitar mismatch de hidratación

### Componentes de UI
- Siempre preferir componentes de shadcn antes de crear HTML desde cero
- Para agregar uno nuevo: `npx shadcn@latest add <nombre>`
- Los componentes custom van en `components/ui/` (ej: `price-display.tsx`)

### Imágenes externas
- Permitidas: `images.unsplash.com` y `picsum.photos` (configurado en `next.config.ts`)
- Usar siempre `<Image>` de Next.js con `fill` + `sizes` apropiado, nunca `<img>`
- Si una URL de Unsplash da 404, reemplazar con otra foto o con picsum

---

## Datos mock

Actualmente en `lib/mock-data.ts`. Al conectar la base de datos, estos helpers se reemplazarán por Route Handlers + Prisma.

```ts
import {
  products,           // Product[] — 20 productos
  categories,         // Category[] — 10 categorías
  getFeaturedProducts,
  getProductBySlug,
  getProductsByCategory,
  searchProducts,
  filterProducts,     // (products, FilterState) => Product[]
  sortProducts,       // (products, SortOption) => Product[]
  uniqueBrands,       // string[]
  maxProductPrice,    // number
} from '@/lib/mock-data'
```

---

## Admin dashboard

- Ruta: `/admin` — tiene su **propio layout** independiente del store (sin TopBar/Navbar/Footer)
- Es un layout `'use client'` con sidebar colapsable
- Ruta para volver a la tienda: `/` (botón "View Store" en el sidebar)

---

## Schema Prisma

El schema está definido en `prisma/schema.prisma` pero **no está migrado** (sin base de datos activa).
No correr `prisma migrate` ni `prisma db push` hasta configurar `DATABASE_URL` en `.env`.

Modelos: `User · Category · Product · ProductImage · CartItem · Wishlist · Address · Order · OrderItem`

---

## Qué NO hacer

- No usar `bun` ni `yarn` — solo `npm`
- No usar server actions — usar Route Handlers (`app/api/`)
- No usar modales para crear/editar datos — usar páginas dedicadas para formularios
- No migrar Prisma sin una base de datos PostgreSQL configurada
- No hardcodear colores hex; usar clases Tailwind con las variables CSS
- No editar los archivos de `components/ui/` generados por shadcn (excepto `price-display.tsx` que es custom)
- No usar `<img>` — siempre `<Image>` de Next.js
- No commitear `.env`

 ## Rules

- Al momento de crear datos nuevos no uses Modales, usa paginas dedicadas para los formularios
- no uses server actions, usa Route handlers para manejo de estado global usa Zustand para formularios usar react-hook-form y zod