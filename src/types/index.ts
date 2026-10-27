export type PriceUnit = 'per piece' | 'per metre' | 'per set' | 'per pair'

export interface ColorOption {
  name: string
  hex: string
}

export interface Variant {
  sku: string
  color?: string
  size?: string
  stock: number
}

export type SizeGuideKind = 'women-ethnic' | 'men-tops' | 'men-trousers'

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  /** Primary category slug (used for breadcrumbs). */
  category: string
  /** Every category this product is listed under. */
  categories: string[]
  subcategory: string
  price: number
  /** Original price. Equal to price when there is no discount. */
  mrp: number
  priceUnit: PriceUnit
  images: string[]
  description: string
  material: string
  occasion: string[]
  attributes: Record<string, string>
  colors: ColorOption[]
  sizes: string[]
  variants: Variant[]
  sizeGuide?: SizeGuideKind
  rating: number
  reviewCount: number
  isNew: boolean
  isBestseller: boolean
  createdAt: string
  tags: string[]
}

export interface Category {
  slug: string
  name: string
  shortName?: string
  description: string
  image: string
  subcategories: string[]
}

export interface Collection {
  slug: string
  title: string
  subtitle: string
  description: string
  image: string
  productIds: string[]
  /** Where "Shop the edit" points to. */
  href: string
}

export interface BudgetRange {
  id: string
  label: string
  shortLabel: string
  min: number
  /** Inclusive upper bound; null means no upper limit. */
  max: number | null
}

export type CouponKind = 'percent' | 'flat' | 'shipping'

export interface Coupon {
  code: string
  kind: CouponKind
  value: number
  minSubtotal: number
  description: string
}

export interface CartItem {
  /** productId + variant sku */
  key: string
  productId: string
  sku: string
  color?: string
  size?: string
  quantity: number
}

export interface Address {
  id: string
  fullName: string
  phone: string
  pincode: string
  line1: string
  line2: string
  landmark: string
  city: string
  state: string
  isDefault: boolean
}

export type DeliveryMethod = 'standard' | 'express'
export type PaymentMethod = 'cod' | 'upi' | 'card-netbanking'

export interface OrderLine {
  productId: string
  slug: string
  name: string
  brand: string
  image: string
  color?: string
  size?: string
  price: number
  mrp: number
  priceUnit: PriceUnit
  quantity: number
}

export interface PriceSummary {
  subtotal: number
  mrpTotal: number
  savings: number
  couponDiscount: number
  shipping: number
  total: number
  itemCount: number
}

export interface Order {
  id: string
  createdAt: string
  email: string
  phone: string
  address: Omit<Address, 'id' | 'isDefault'>
  delivery: DeliveryMethod
  payment: PaymentMethod
  couponCode?: string
  lines: OrderLine[]
  summary: PriceSummary
  estimatedDelivery: { from: string; to: string }
  cancelledAt?: string
}

export interface Review {
  id: string
  productId: string
  author: string
  city: string
  rating: number
  title: string
  body: string
  date: string
}

export interface User {
  name: string
  email: string
  phone?: string
}
