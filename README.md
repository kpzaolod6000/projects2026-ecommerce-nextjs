# TechStore — Ecommerce de Hardware

Tienda online de productos de computación (PCs, Monitores, Teclados, Mouse, Headsets, etc.) construida con Next.js 16, TypeScript, Tailwind CSS v4 y Prisma + PostgreSQL.

---

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Lenguaje | TypeScript strict |
| Estilos | Tailwind CSS v4 |
| Componentes UI | shadcn/ui v3 (Radix UI) |
| Iconos | lucide-react |
| Dark mode | next-themes |
| Autenticación | NextAuth v5 (Credentials + Google OAuth) |
| ORM | Prisma 7 |
| Base de datos | PostgreSQL 16 (vía Docker) |
| Estado global | Zustand |
| Formularios | react-hook-form + zod |
| Package manager | npm |

---

## Requisitos previos

- [Node.js](https://nodejs.org/) 20+
- [Docker](https://www.docker.com/) y Docker Compose
- npm (no usar bun ni pnpm)

---

## Configuración inicial

### 1. Clonar e instalar dependencias

```bash
git clone <url-del-repo>
cd ecommerce-basic
npm install
```

### 2. Variables de entorno

Crear el archivo `.env` en la raíz del proyecto:

```env
# Base de datos
DATABASE_URL="postgresql://techstore:techstore_password@localhost:5432/techstore"

# NextAuth
AUTH_SECRET="genera-un-secreto-aleatorio-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (opcional)
AUTH_GOOGLE_ID="tu-google-client-id"
AUTH_GOOGLE_SECRET="tu-google-client-secret"
```

Para generar `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

> **Importante:** nunca commitear el archivo `.env`.

---

## Levantar la base de datos

### Con Docker Compose

```bash
# Iniciar PostgreSQL en segundo plano
docker compose up -d

# Verificar que está corriendo
docker compose ps

# Ver logs
docker compose logs postgres

# Detener
docker compose down

# Detener y eliminar volúmenes (borra todos los datos)
docker compose down -v
```

El contenedor expone PostgreSQL en `localhost:5432` con:

| Parámetro | Valor |
|-----------|-------|
| Usuario | `techstore` |
| Contraseña | `techstore_password` |
| Base de datos | `techstore` |

---

## Configurar Prisma

### Generar el cliente Prisma

```bash
npx prisma generate
```

### Aplicar el schema a la base de datos

```bash
# Crea las tablas en la DB (primera vez o tras cambios en schema.prisma)
npx prisma migrate dev --name init
```

### Seed — poblar con datos iniciales

Si existe `prisma/seed.ts`:

```bash
npx prisma db seed
```

### Explorar la base de datos con Prisma Studio

```bash
npx prisma studio
# Abre http://localhost:5555
```

### Flujo completo desde cero

```bash
docker compose up -d           # 1. Levantar PostgreSQL
npx prisma generate            # 2. Generar el cliente
npx prisma migrate dev --name init  # 3. Crear tablas
npx prisma db seed             # 4. Insertar datos de ejemplo (si hay seed)
npm run dev                    # 5. Iniciar el servidor
```

---

## Desarrollo

```bash
npm run dev      # Servidor de desarrollo en http://localhost:3000 (Turbopack)
npm run build    # Build de producción + chequeo TypeScript
npm run lint     # ESLint
```

> Antes de considerar una tarea terminada, correr `npm run build` para verificar que no hay errores.

---

## Estructura del proyecto

```
ecommerce-basic/
├── app/
│   ├── layout.tsx                  ← Root layout: ThemeProvider + html/body
│   ├── globals.css                 ← Tokens Tailwind v4 + variables HSL
│   ├── api/                        ← Route Handlers (mutaciones de datos)
│   ├── (store)/                    ← Route group — tienda pública
│   │   ├── layout.tsx              ← TopBar + Navbar + Footer
│   │   ├── page.tsx                ← Homepage
│   │   ├── products/
│   │   │   ├── page.tsx            ← Listado con filtros
│   │   │   └── [slug]/page.tsx     ← Detalle de producto
│   │   ├── categories/[slug]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── account/page.tsx        ← Login / Register
│   │   └── search/page.tsx
│   └── admin/                      ← Dashboard de administración
│       ├── layout.tsx              ← Sidebar + header (sin store chrome)
│       ├── page.tsx                ← Overview / estadísticas
│       ├── products/page.tsx
│       ├── payments/page.tsx
│       └── users/page.tsx
├── components/
│   ├── theme-provider.tsx
│   ├── layout/                     ← top-bar, navbar, footer, search-bar, mobile-menu, theme-toggle
│   ├── product/                    ← product-card, product-grid, product-filters, product-images,
│   │                                  product-info, product-badge, star-rating, wishlist-button
│   ├── cart/                       ← cart-item, cart-summary
│   ├── sections/                   ← hero-banner, category-grid, featured-products, filter-bar
│   └── ui/                         ← shadcn/ui + price-display (custom)
├── lib/
│   ├── db.ts                       ← Instancia singleton de Prisma Client
│   ├── utils.ts                    ← cn(), formatPrice(), getDiscountPercent(), slugify()
│   └── mock-data.ts                ← Datos mock (20 productos, 10 categorías)
├── types/
│   └── index.ts                    ← Product, Category, CartItem, FilterState, etc.
├── prisma/
│   ├── schema.prisma               ← Schema completo de la base de datos
│   └── seed.ts                     ← Script para poblar datos iniciales
├── auth.ts                         ← Configuración NextAuth (Credentials + Google)
├── auth.config.ts                  ← Callbacks JWT/session
├── middleware.ts                   ← Protección de rutas con NextAuth
├── docker-compose.yml              ← PostgreSQL 16 en Docker
└── next.config.ts                  ← Configuración Next.js (remote images, etc.)
```

---

## Autenticación

El sistema usa **NextAuth v5** con dos proveedores:

- **Credentials** — email + contraseña hasheada con bcrypt
- **Google OAuth** — requiere `AUTH_GOOGLE_ID` y `AUTH_GOOGLE_SECRET`

Las sesiones usan estrategia **JWT**. El adapter de Prisma persiste usuarios, cuentas y sesiones en PostgreSQL.

Roles disponibles: `CUSTOMER` (por defecto), `MANAGER`, `ADMIN`.

---

## Schema de base de datos

Modelos principales en `prisma/schema.prisma`:

| Modelo | Descripción |
|--------|-------------|
| `User` | Usuarios con roles (CUSTOMER / MANAGER / ADMIN) |
| `Account` | Cuentas OAuth (NextAuth) |
| `Session` | Sesiones activas (NextAuth) |
| `Category` | Categorías auto-referenciales (padre/hijo) |
| `Product` | Productos con specs JSON, tags, variantes |
| `ProductImage` | Imágenes de producto (múltiples por producto) |
| `ProductVariant` | Variantes con stock y precio propios |
| `Review` | Reseñas de usuario (1 por usuario/producto) |
| `CartItem` | Carrito de usuarios autenticados |
| `Wishlist` | Lista de deseos |
| `Address` | Direcciones de envío |
| `Order` | Órdenes con número único (ej: ORD-2024-00042) |
| `OrderItem` | Líneas de orden con precio snapshot |

---

## Convenciones importantes

- **No usar server actions** — toda mutación va a través de Route Handlers (`app/api/`)
- **No usar modales** para crear/editar datos — usar páginas dedicadas con formularios
- **Estado global** con Zustand, **formularios** con react-hook-form + zod
- Componentes son **Server Components** por defecto; agregar `'use client'` solo cuando sea necesario
- Usar siempre `<Image>` de Next.js, nunca `<img>`
- No hardcodear colores hex — usar clases Tailwind con variables CSS

---

## Agregar componentes shadcn

```bash
npx shadcn@latest add <nombre-del-componente>
```

Los componentes generados se instalan en `components/ui/` — no modificarlos directamente (excepto `price-display.tsx` que es custom).
