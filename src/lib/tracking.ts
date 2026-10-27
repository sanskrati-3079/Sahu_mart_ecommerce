import type { Order, PaymentMethod } from '@/types'

export const ORDER_STEPS = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for delivery', 'Delivered'] as const
export type OrderStep = (typeof ORDER_STEPS)[number]

const MIN = 60 * 1000
const HOUR = 60 * MIN

function atHour(iso: string, hour: number): number {
  const d = new Date(iso)
  d.setHours(hour, 0, 0, 0)
  return d.getTime()
}

/**
 * Simulated timeline. Confirmation and packing happen within minutes so the demo visibly
 * progresses; later stages follow the estimated delivery date saved on the order.
 */
export function orderTimeline(order: Order): { step: OrderStep; at: number }[] {
  const placed = new Date(order.createdAt).getTime()
  const shipped = placed + 2 * HOUR
  const outFor = Math.max(atHour(order.estimatedDelivery.from, 9), shipped + HOUR)
  return [
    { step: 'Placed', at: placed },
    { step: 'Confirmed', at: placed + 2 * MIN },
    { step: 'Packed', at: placed + 15 * MIN },
    { step: 'Shipped', at: shipped },
    { step: 'Out for delivery', at: outFor },
    { step: 'Delivered', at: outFor + 8 * HOUR },
  ]
}

export function orderStatus(order: Order, now = Date.now()): { index: number; step: OrderStep | 'Cancelled' } {
  if (order.cancelledAt) return { index: -1, step: 'Cancelled' }
  const timeline = orderTimeline(order)
  let index = 0
  timeline.forEach((t, i) => {
    if (now >= t.at) index = i
  })
  return { index, step: timeline[index].step }
}

export function canCancel(order: Order, now = Date.now()): boolean {
  const { index } = orderStatus(order, now)
  return !order.cancelledAt && index >= 0 && index <= 1
}

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cod: 'Cash on Delivery',
  upi: 'UPI',
  'card-netbanking': 'Card / Net Banking',
}
