import { budgets } from '@/data/budgets'
import { COLORS } from '@/data/colors'
import type { ColorOption, Product } from '@/types'
import { discountPercent, formatINR } from './format'
import { isInStock } from './catalog'

export type SortKey = 'recommended' | 'price-asc' | 'price-desc' | 'newest' | 'rating' | 'bestselling'

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'bestselling', label: 'Bestselling' },
]

export const MULTI_KEYS = ['sub', 'brand', 'color', 'size', 'material', 'occasion'] as const
export type MultiKey = (typeof MULTI_KEYS)[number]

export interface FilterState {
  sort: SortKey
  min?: number
  max?: number
  sub: string[]
  brand: string[]
  color: string[]
  size: string[]
  material: string[]
  occasion: string[]
  rating?: number
  inStock: boolean
  discount?: number
}

export const FACET_LABELS: Record<MultiKey, string> = {
  sub: 'Category',
  brand: 'Brand',
  color: 'Colour',
  size: 'Size',
  material: 'Material / Fabric',
  occasion: 'Occasion',
}

const num = (v: string | null) => {
  if (v === null || v === '') return undefined
  const n = Number(v)
  return Number.isFinite(n) && n >= 0 ? n : undefined
}

export function parseFilters(sp: URLSearchParams): FilterState {
  const sort = (sp.get('sort') as SortKey) ?? 'recommended'
  return {
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? sort : 'recommended',
    min: num(sp.get('min')),
    max: num(sp.get('max')),
    sub: sp.getAll('sub'),
    brand: sp.getAll('brand'),
    color: sp.getAll('color'),
    size: sp.getAll('size'),
    material: sp.getAll('material'),
    occasion: sp.getAll('occasion'),
    rating: num(sp.get('rating')),
    inStock: sp.get('stock') === 'in',
    discount: num(sp.get('discount')),
  }
}

/** Writes filter state into an existing URLSearchParams (keeps unrelated keys like `q`). */
export function writeFilters(base: URLSearchParams, f: FilterState): URLSearchParams {
  const sp = new URLSearchParams(base)
  for (const k of ['sort', 'min', 'max', 'rating', 'stock', 'discount', ...MULTI_KEYS]) sp.delete(k)
  if (f.sort !== 'recommended') sp.set('sort', f.sort)
  if (f.min !== undefined) sp.set('min', String(f.min))
  if (f.max !== undefined) sp.set('max', String(f.max))
  for (const k of MULTI_KEYS) f[k].forEach((v) => sp.append(k, v))
  if (f.rating) sp.set('rating', String(f.rating))
  if (f.inStock) sp.set('stock', 'in')
  if (f.discount) sp.set('discount', String(f.discount))
  return sp
}

function productValues(p: Product, key: MultiKey): string[] {
  switch (key) {
    case 'sub':
      return [p.subcategory]
    case 'brand':
      return [p.brand]
    case 'color':
      return p.colors.map((c) => c.name)
    case 'size':
      return p.sizes
    case 'material':
      return [p.material]
    case 'occasion':
      return p.occasion
  }
}

type Exclude = MultiKey | 'price' | 'rating' | 'stock' | 'discount'

export function applyFilters(list: Product[], f: FilterState, exclude?: Exclude): Product[] {
  return list.filter((p) => {
    if (exclude !== 'price') {
      if (f.min !== undefined && p.price < f.min) return false
      if (f.max !== undefined && p.price > f.max) return false
    }
    for (const k of MULTI_KEYS) {
      if (k === exclude || !f[k].length) continue
      const values = productValues(p, k)
      if (!f[k].some((v) => values.includes(v))) return false
    }
    if (exclude !== 'rating' && f.rating && p.rating < f.rating) return false
    if (exclude !== 'stock' && f.inStock && !isInStock(p)) return false
    if (exclude !== 'discount' && f.discount && discountPercent(p.price, p.mrp) < f.discount) return false
    return true
  })
}

function recommendedScore(p: Product): number {
  return (p.isBestseller ? 2 : 0) + (p.isNew ? 0.6 : 0) + p.rating + Math.log10(p.reviewCount + 1) - (isInStock(p) ? 0 : 10)
}

export function sortProducts(list: Product[], sort: SortKey, relevance?: Map<string, number>): Product[] {
  const out = [...list]
  switch (sort) {
    case 'price-asc':
      return out.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return out.sort((a, b) => b.price - a.price)
    case 'newest':
      return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    case 'rating':
      return out.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    case 'bestselling':
      return out.sort((a, b) => Number(b.isBestseller) - Number(a.isBestseller) || b.reviewCount - a.reviewCount)
    default:
      if (relevance) return out.sort((a, b) => (relevance.get(b.id) ?? 0) - (relevance.get(a.id) ?? 0))
      return out.sort((a, b) => recommendedScore(b) - recommendedScore(a))
  }
}

export interface FacetOption {
  value: string
  count: number
  color?: ColorOption
}

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size']
function sizeRank(s: string): number {
  const i = SIZE_ORDER.indexOf(s)
  if (i >= 0) return i
  const n = parseFloat(s)
  return Number.isFinite(n) ? 100 + n : 1000
}

const colorByName = new Map(Object.values(COLORS).map((c) => [c.name, c as ColorOption]))

/** Facet options with counts. Counts respect every active filter except the facet's own. */
export function buildFacets(base: Product[], f: FilterState): Record<MultiKey, FacetOption[]> {
  const result = {} as Record<MultiKey, FacetOption[]>
  for (const key of MULTI_KEYS) {
    const all = new Set(base.flatMap((p) => productValues(p, key)))
    const scoped = applyFilters(base, f, key)
    const counts = new Map<string, number>()
    for (const p of scoped) for (const v of new Set(productValues(p, key))) counts.set(v, (counts.get(v) ?? 0) + 1)
    let options = [...all].map((value) => ({
      value,
      count: counts.get(value) ?? 0,
      color: key === 'color' ? colorByName.get(value) : undefined,
    }))
    options =
      key === 'size'
        ? options.sort((a, b) => sizeRank(a.value) - sizeRank(b.value) || a.value.localeCompare(b.value))
        : options.sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
    result[key] = options
  }
  return result
}

export function priceBounds(list: Product[]): [number, number] {
  if (!list.length) return [0, 15000]
  const prices = list.map((p) => p.price)
  return [Math.floor(Math.min(...prices) / 100) * 100, Math.ceil(Math.max(...prices) / 100) * 100]
}

/** Number of products if `patch` were applied on top of the current filters. */
export function countWith(base: Product[], f: FilterState, patch: Partial<FilterState>): number {
  return applyFilters(base, { ...f, ...patch }).length
}

export function activeBudgetId(f: FilterState): string | undefined {
  return budgets.find((b) => (f.min ?? 0) === b.min && (f.max ?? null) === b.max)?.id
}

export function hasActiveFilters(f: FilterState): boolean {
  return (
    f.min !== undefined ||
    f.max !== undefined ||
    MULTI_KEYS.some((k) => f[k].length > 0) ||
    Boolean(f.rating) ||
    f.inStock ||
    Boolean(f.discount)
  )
}

export function clearFilters(f: FilterState): FilterState {
  return { sort: f.sort, sub: [], brand: [], color: [], size: [], material: [], occasion: [], inStock: false }
}

/** Human label for a price range, e.g. "Under ₹999". */
export function priceLabel(min?: number, max?: number): string {
  if (min !== undefined && max !== undefined) return `${formatINR(min)} – ${formatINR(max)}`
  if (max !== undefined) return `Under ${formatINR(max)}`
  return `${formatINR(min ?? 0)} & above`
}
