export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  children?: Category[]
  _count?: { products: number }
}

export interface ProductImage {
  id: string
  url: string
  alt?: string
  isPrimary: boolean
  sortOrder: number
}

export interface ProductVariant {
  id: string
  productId: string
  sku: string
  name: string
  attributes: Record<string, string>
  stock: number
  price?: number
  comparePrice?: number
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  sku: string
  stock: number
  category: Category
  categoryId: string
  images: ProductImage[]
  variants?: ProductVariant[]
  specs: Record<string, string | number | boolean>
  tags: string[]
  colors?: string[]
  brand: string
  rating: number
  reviewCount: number
  isFeatured: boolean
  isOnSale: boolean
  isNew: boolean
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED'
  createdAt: string
}

export interface CartItem {
  id: string
  product: Product
  productId: string
  quantity: number
  selectedColor?: string
  variantId?: string
  variant?: ProductVariant
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
}

export interface FilterState {
  categories: string[]
  brands: string[]
  minPrice: number
  maxPrice: number
  minRating: number
  inStock: boolean
  isOnSale: boolean
  isNew: boolean
}

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'newest'
  | 'name-asc'

export interface WishlistItem {
  id: string
  productId: string
  product: Product
}

export interface Address {
  id: string
  street: string
  city: string
  state: string
  country: string
  postalCode: string
  isDefault: boolean
}

export interface OrderItem {
  id: string
  product: Product
  productId: string
  quantity: number
  priceAtTime: number
}

export interface Order {
  id: string
  items: OrderItem[]
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingAddress: Address
  createdAt: string
}

export interface ReviewSummary {
  average: number
  count: number
  distribution: Record<1 | 2 | 3 | 4 | 5, number>
}
