# Modelo de Datos — TechStore

Documenta el schema de Prisma y las decisiones de diseño del modelo de datos.

---

## Stack de base de datos

- **ORM**: Prisma 7
- **BD**: PostgreSQL
- **Schema**: `prisma/schema.prisma`

> El schema está definido pero **no migrado**. No correr `prisma migrate` ni `prisma db push` hasta configurar `DATABASE_URL` en `.env`.

---

## Decisiones de diseño

| Área | Decisión |
|------|----------|
| Auth | NextAuth + credenciales (social login + email/password) |
| Reviews | Modelo `Review` propio; `rating`/`reviewCount` en `Product` son campos cacheados |
| Pagos | Sin modelo de pago por ahora — se integra en fase posterior |
| Variantes | `ProductVariant` con atributos JSON y stock individual por variante |
| Roles | Enum `ADMIN / MANAGER / CUSTOMER` |
| Carrito guest | Zustand en cliente; se fusiona al hacer login |
| Cupones | Sin modelo por ahora — `comparePrice` cubre descuentos visuales |

---

## Diagrama de entidades

```
User ──────────────────────────────────────────────────────────┐
 ├── Account[]          (OAuth providers — NextAuth)           │
 ├── Session[]          (sesiones activas — NextAuth)          │
 ├── CartItem[]         (carrito persistido en DB)             │
 ├── Wishlist[]                                                │
 ├── Address[]                                                 │
 ├── Order[]                                                   │
 └── Review[]                                                  │
                                                               │
Category (jerárquica: parent/children)                         │
 └── Product[]                                                 │
      ├── ProductImage[]                                       │
      ├── ProductVariant[]  (sku, attributes JSON, stock)      │
      ├── Review[]  ─────────────────────────────── User ──────┘
      ├── CartItem[]
      ├── Wishlist[]
      └── OrderItem[]

Order
 ├── OrderItem[]  →  Product + ProductVariant?
 └── shippingAddress  →  Address
```

---

## Modelos

### `User`

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | `String` (cuid) | PK |
| `email` | `String` | único |
| `emailVerified` | `DateTime?` | requerido por NextAuth |
| `name` | `String?` | |
| `image` | `String?` | URL avatar |
| `passwordHash` | `String?` | solo para auth por credenciales |
| `phone` | `String?` | |
| `role` | `Role` | `ADMIN / MANAGER / CUSTOMER` (default: `CUSTOMER`) |

---

### `Account` / `Session` / `VerificationToken`

Modelos estándar de NextAuth. No modificar su estructura.

- `Account` — vincula un `User` a un proveedor OAuth (Google, GitHub, etc.)
- `Session` — sesiones activas por token
- `VerificationToken` — tokens de verificación de email

---

### `Category`

Soporta jerarquía con auto-relación `parent / children`.

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | `String` (cuid) | PK |
| `name` | `String` | |
| `slug` | `String` | único, indexado |
| `description` | `String?` | |
| `image` | `String?` | URL |
| `parentId` | `String?` | null = categoría raíz |

---

### `Product`

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | `String` (cuid) | PK |
| `name` | `String` | |
| `slug` | `String` | único, indexado |
| `description` | `String` | texto largo |
| `price` | `Decimal(10,2)` | precio base |
| `comparePrice` | `Decimal(10,2)?` | precio tachado (descuento visual) |
| `sku` | `String` | único |
| `stock` | `Int` | total agregado — se sincroniza con variantes |
| `brand` | `String` | |
| `rating` | `Float` | promedio cacheado; se actualiza al crear/editar `Review` |
| `reviewCount` | `Int` | conteo cacheado |
| `isFeatured` | `Boolean` | |
| `isOnSale` | `Boolean` | |
| `isNew` | `Boolean` | |
| `status` | `ProductStatus` | `ACTIVE / DRAFT / ARCHIVED` |
| `specs` | `Json` | especificaciones técnicas clave-valor |
| `tags` | `String[]` | |

---

### `ProductVariant`

Cada variante tiene stock propio y puede sobreescribir el precio base.

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | `String` (cuid) | PK |
| `productId` | `String` | FK → `Product` |
| `sku` | `String` | único |
| `name` | `String` | Ej: `"Negro / XL"` |
| `attributes` | `Json` | Ej: `{ "color": "Negro", "size": "XL" }` |
| `stock` | `Int` | stock individual de esta variante |
| `price` | `Decimal(10,2)?` | sobreescribe `Product.price` si se define |
| `comparePrice` | `Decimal(10,2)?` | sobreescribe `Product.comparePrice` si se define |

> **Precio efectivo**: `variant.price ?? product.price`

---

### `ProductImage`

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | `String` (cuid) | PK |
| `productId` | `String` | FK → `Product` (cascade delete) |
| `url` | `String` | |
| `alt` | `String?` | |
| `isPrimary` | `Boolean` | imagen principal del producto |
| `sortOrder` | `Int` | orden en galería |

---

### `Review`

Un usuario puede escribir una sola reseña por producto (`@@unique([userId, productId])`).

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | `String` (cuid) | PK |
| `userId` | `String` | FK → `User` |
| `productId` | `String` | FK → `Product` |
| `rating` | `Int` | 1–5 |
| `title` | `String?` | |
| `body` | `String` | texto largo |

> Al crear o editar una `Review`, el Route Handler debe recalcular y actualizar `Product.rating` y `Product.reviewCount`.

---

### `CartItem`

Carrito persistido para usuarios autenticados. El carrito de invitados (guest) se gestiona con Zustand en el cliente y se fusiona al hacer login.

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | `String` (cuid) | PK |
| `userId` | `String` | FK → `User` |
| `productId` | `String` | FK → `Product` |
| `variantId` | `String?` | FK → `ProductVariant` |
| `quantity` | `Int` | |

> `@@unique([userId, productId, variantId])` — un registro por combinación producto+variante por usuario.

---

### `Wishlist`

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | `String` (cuid) | PK |
| `userId` | `String` | FK → `User` |
| `productId` | `String` | FK → `Product` |

---

### `Address`

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | `String` (cuid) | PK |
| `userId` | `String` | FK → `User` |
| `name` | `String` | nombre del destinatario |
| `phone` | `String?` | |
| `street` | `String` | |
| `city` | `String` | |
| `state` | `String` | |
| `country` | `String` | |
| `postalCode` | `String` | |
| `isDefault` | `Boolean` | dirección predeterminada del usuario |

---

### `Order`

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | `String` (cuid) | PK |
| `number` | `String` | único, legible — Ej: `"ORD-2024-00042"` |
| `status` | `OrderStatus` | `PENDING / PROCESSING / SHIPPED / DELIVERED / CANCELLED` |
| `subtotal` | `Decimal(10,2)` | |
| `shipping` | `Decimal(10,2)` | |
| `tax` | `Decimal(10,2)` | |
| `total` | `Decimal(10,2)` | |
| `trackingNumber` | `String?` | número de seguimiento del envío |
| `notes` | `String?` | notas internas o del cliente |
| `userId` | `String` | FK → `User` |
| `shippingAddressId` | `String` | FK → `Address` |

---

### `OrderItem`

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | `String` (cuid) | PK |
| `orderId` | `String` | FK → `Order` (cascade delete) |
| `productId` | `String` | FK → `Product` |
| `variantId` | `String?` | FK → `ProductVariant` |
| `quantity` | `Int` | |
| `priceAtTime` | `Decimal(10,2)` | snapshot del precio al momento de compra |
| `variantName` | `String?` | snapshot del nombre de variante (Ej: `"Negro / XL"`) |

> Los snapshots (`priceAtTime`, `variantName`) preservan el estado del pedido aunque el producto cambie después.

---

## Enums

```prisma
enum Role {
  ADMIN
  MANAGER
  CUSTOMER
}

enum ProductStatus {
  ACTIVE
  DRAFT
  ARCHIVED
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}
```

---

## Índices clave

| Modelo | Campo(s) | Motivo |
|--------|----------|--------|
| `Category` | `slug` | lookup por URL |
| `Product` | `slug`, `categoryId`, `isFeatured`, `isOnSale`, `status` | filtros frecuentes |
| `ProductVariant` | `productId`, `sku` | lookup por producto y SKU |
| `ProductImage` | `productId` | carga de galería |
| `Review` | `productId`, `userId` | listado de reseñas + unicidad |
| `CartItem` | `userId` | carrito del usuario |
| `Wishlist` | `userId` | lista de deseos del usuario |
| `Address` | `userId` | direcciones del usuario |
| `Order` | `userId`, `status`, `number` | historial + filtros admin |
| `OrderItem` | `orderId` | items del pedido |
| `Account` | `userId` | lookup OAuth |
| `Session` | `userId` | lookup de sesión |
