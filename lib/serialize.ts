function decimalToNumber(val: unknown): number | undefined {
  if (val == null) return undefined
  return Number(val)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeProduct(product: any) {
  return {
    ...product,
    price: decimalToNumber(product.price)!,
    comparePrice: decimalToNumber(product.comparePrice),
    createdAt: product.createdAt instanceof Date ? product.createdAt.toISOString() : product.createdAt,
    updatedAt: product.updatedAt instanceof Date ? product.updatedAt.toISOString() : product.updatedAt,
    images: product.images?.map((img: any) => ({
      ...img,
      createdAt: img.createdAt instanceof Date ? img.createdAt.toISOString() : img.createdAt,
    })) ?? [],
    variants: product.variants?.map((v: any) => ({
      ...v,
      price: decimalToNumber(v.price),
      comparePrice: decimalToNumber(v.comparePrice),
      createdAt: v.createdAt instanceof Date ? v.createdAt.toISOString() : v.createdAt,
      updatedAt: v.updatedAt instanceof Date ? v.updatedAt.toISOString() : v.updatedAt,
    })) ?? [],
    category: product.category
      ? {
          ...product.category,
          createdAt: product.category.createdAt instanceof Date ? product.category.createdAt.toISOString() : product.category.createdAt,
          updatedAt: product.category.updatedAt instanceof Date ? product.category.updatedAt.toISOString() : product.category.updatedAt,
        }
      : undefined,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeOrder(order: any) {
  return {
    ...order,
    subtotal: decimalToNumber(order.subtotal)!,
    shipping: decimalToNumber(order.shipping)!,
    tax: decimalToNumber(order.tax)!,
    total: decimalToNumber(order.total)!,
    createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt,
    updatedAt: order.updatedAt instanceof Date ? order.updatedAt.toISOString() : order.updatedAt,
    items: order.items?.map((item: any) => ({
      ...item,
      priceAtTime: decimalToNumber(item.priceAtTime)!,
      createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
      product: item.product ? serializeProduct(item.product) : undefined,
    })) ?? [],
    user: order.user
      ? {
          id: order.user.id,
          name: order.user.name,
          email: order.user.email,
        }
      : undefined,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeUser(user: any) {
  return {
    ...user,
    passwordHash: undefined,
    createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
    updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : user.updatedAt,
  }
}
