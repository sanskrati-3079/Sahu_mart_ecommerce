import type { Product, Variant } from '@/types'

export const needsColor = (p: Product) => p.colors.length > 1
export const needsSize = (p: Product) => p.sizes.length > 1

/**
 * Initial selection: the first in-stock colour (the one shown in the photos) and the size only
 * when there is a single option. Shoppers must always choose a size themselves.
 */
export function defaultSelection(p: Product): { color?: string; size?: string } {
  const color = p.colors.find((c) => colorStock(p, c.name) > 0)?.name ?? (p.colors.length === 1 ? p.colors[0].name : undefined)
  return {
    color,
    size: p.sizes.length === 1 ? p.sizes[0] : undefined,
  }
}

export function findVariant(p: Product, color?: string, size?: string): Variant | undefined {
  return p.variants.find((v) => (p.colors.length ? v.color === color : true) && (p.sizes.length ? v.size === size : true))
}

export function colorStock(p: Product, color: string): number {
  return p.variants.filter((v) => v.color === color).reduce((s, v) => s + v.stock, 0)
}

export function sizeStock(p: Product, size: string, color?: string): number {
  return p.variants.filter((v) => v.size === size && (color ? v.color === color : true)).reduce((s, v) => s + v.stock, 0)
}

export function selectionHint(p: Product, color?: string, size?: string): string | null {
  const missing: string[] = []
  if (p.colors.length && !color) missing.push('colour')
  if (p.sizes.length && !size) missing.push(sizeLabel(p).toLowerCase())
  if (!missing.length) return null
  return `Please select a ${missing.join(' and ')} to continue.`
}

export function sizeLabel(p: Product): string {
  if (p.category === 'luggage') return 'Size'
  if (p.sizes.some((s) => s.includes('&'))) return 'Fragrance'
  if (p.sizes.every((s) => ['Double', 'King', 'Single', 'Queen'].includes(s))) return 'Bed size'
  if (p.category === 'jewellery') return 'Bangle size'
  if (p.category === 'trousers') return 'Waist'
  return 'Size'
}

export function quantityLabel(p: Product): string {
  return p.priceUnit === 'per metre' ? 'Metres' : 'Quantity'
}
