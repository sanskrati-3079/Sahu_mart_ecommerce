import type { Coupon } from '@/types'

export const coupons: Coupon[] = [
  { code: 'WELCOME10', kind: 'percent', value: 10, minSubtotal: 999, description: '10% off on orders of ₹999 and above' },
  { code: 'FESTIVE250', kind: 'flat', value: 250, minSubtotal: 2499, description: '₹250 off on orders of ₹2,499 and above' },
  { code: 'FREESHIP', kind: 'shipping', value: 0, minSubtotal: 0, description: 'Free standard shipping on any order' },
]
