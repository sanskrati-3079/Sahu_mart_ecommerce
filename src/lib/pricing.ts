import { coupons } from '@/data/coupons'
import type { CartItem, Coupon, DeliveryMethod, PriceSummary, Product } from '@/types'
import { formatINR } from './format'

/** All money rules for the store live in this file. */
export const FREE_SHIPPING_THRESHOLD = 999
export const STANDARD_SHIPPING_FEE = 79
export const EXPRESS_SHIPPING_FEE = 149

export interface PricedLine {
  product: Product
  quantity: number
}

export type CouponResult = { ok: true; coupon: Coupon } | { ok: false; error: string }

export function findCoupon(code: string): Coupon | undefined {
  return coupons.find((c) => c.code === code.trim().toUpperCase())
}

export function validateCoupon(code: string, subtotal: number): CouponResult {
  const trimmed = code.trim()
  if (!trimmed) return { ok: false, error: 'Please enter a coupon code.' }
  const coupon = findCoupon(trimmed)
  if (!coupon) return { ok: false, error: `“${trimmed.toUpperCase()}” is not a valid coupon code.` }
  if (subtotal < coupon.minSubtotal) {
    return {
      ok: false,
      error: `${coupon.code} needs a minimum order of ${formatINR(coupon.minSubtotal)}. Add ${formatINR(coupon.minSubtotal - subtotal)} more to use it.`,
    }
  }
  return { ok: true, coupon }
}

export function couponDiscount(coupon: Coupon | undefined, subtotal: number): number {
  if (!coupon || subtotal < coupon.minSubtotal) return 0
  if (coupon.kind === 'percent') return Math.round((subtotal * coupon.value) / 100)
  if (coupon.kind === 'flat') return Math.min(coupon.value, subtotal)
  return 0
}

export function shippingFee(subtotal: number, delivery: DeliveryMethod = 'standard', coupon?: Coupon): number {
  if (subtotal === 0) return 0
  if (delivery === 'express') return EXPRESS_SHIPPING_FEE
  if (coupon?.kind === 'shipping') return 0
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE
}

/** Amount still needed to unlock free standard shipping (0 when already unlocked). */
export function amountToFreeShipping(subtotal: number): number {
  return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
}

export function summarize(
  lines: PricedLine[],
  options: { couponCode?: string; delivery?: DeliveryMethod } = {},
): PriceSummary & { coupon?: Coupon } {
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.quantity, 0)
  const mrpTotal = lines.reduce((s, l) => s + l.product.mrp * l.quantity, 0)
  const itemCount = lines.reduce((s, l) => s + l.quantity, 0)
  const found = options.couponCode ? findCoupon(options.couponCode) : undefined
  const coupon = found && subtotal >= found.minSubtotal ? found : undefined
  const discount = couponDiscount(coupon, subtotal)
  const shipping = shippingFee(subtotal, options.delivery, coupon)
  return {
    subtotal,
    mrpTotal,
    savings: mrpTotal - subtotal,
    couponDiscount: discount,
    shipping,
    total: Math.max(0, subtotal - discount + shipping),
    itemCount,
    coupon,
  }
}

export function linesFromCart(items: CartItem[], lookup: (id: string) => Product | undefined): PricedLine[] {
  return items.map((i) => ({ product: lookup(i.productId), quantity: i.quantity })).filter((l): l is PricedLine => Boolean(l.product))
}
