import { useMemo } from 'react'
import { getProductById } from '@/lib/catalog'
import { amountToFreeShipping, summarize } from '@/lib/pricing'
import { useCart } from '@/store/cart'
import type { CartItem, DeliveryMethod, Product } from '@/types'

export interface CartLine {
  item: CartItem
  product: Product
  stock: number
}

export function resolveLines(items: CartItem[]): CartLine[] {
  return items
    .map((item) => {
      const product = getProductById(item.productId)
      if (!product) return null
      const stock = product.variants.find((v) => v.sku === item.sku)?.stock ?? 0
      return { item, product, stock }
    })
    .filter((l): l is CartLine => l !== null)
}

/** Bag lines + totals. Every number shown in the bag, drawer and checkout comes from here. */
export function useCartSummary(options: { delivery?: DeliveryMethod; source?: 'bag' | 'buy-now' } = {}) {
  const items = useCart((s) => s.items)
  const buyNow = useCart((s) => s.buyNow)
  const couponCode = useCart((s) => s.couponCode)
  const source = options.source ?? 'bag'
  const delivery = options.delivery

  return useMemo(() => {
    const list = source === 'buy-now' ? (buyNow ? [buyNow] : []) : items
    const lines = resolveLines(list)
    const summary = summarize(
      lines.map((l) => ({ product: l.product, quantity: l.item.quantity })),
      { couponCode, delivery },
    )
    return { lines, summary, couponCode, toFreeShipping: amountToFreeShipping(summary.subtotal) }
  }, [items, buyNow, couponCode, delivery, source])
}
