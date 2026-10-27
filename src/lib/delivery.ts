import type { DeliveryMethod } from '@/types'
import { addDays, formatShortDate } from './format'

export const PINCODE_PATTERN = /^[1-9][0-9]{5}$/

/** Metro pincode prefixes (Delhi, Mumbai, Bengaluru, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad). */
const METRO_PREFIXES = ['11', '40', '56', '60', '70', '50', '41', '38']

export function isValidPincode(pin: string): boolean {
  return PINCODE_PATTERN.test(pin.trim())
}

export function isMetro(pin: string): boolean {
  return METRO_PREFIXES.some((p) => pin.startsWith(p))
}

/** Simulated delivery window in days for a pincode and method. */
export function deliveryWindow(pin: string | undefined, method: DeliveryMethod = 'standard'): [number, number] {
  const metro = pin ? isMetro(pin) : false
  if (method === 'express') return metro ? [1, 2] : [2, 3]
  return metro ? [2, 4] : [4, 7]
}

export function estimateDelivery(pin: string | undefined, method: DeliveryMethod = 'standard', from = new Date()) {
  const [a, b] = deliveryWindow(pin, method)
  const start = addDays(from, a)
  const end = addDays(from, b)
  return {
    from: start.toISOString(),
    to: end.toISOString(),
    label: `${formatShortDate(start)} – ${formatShortDate(end)}`,
  }
}
