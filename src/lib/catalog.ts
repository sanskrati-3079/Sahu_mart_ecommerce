import { products } from '@/data/products'
import { categories } from '@/data/categories'
import { budgets } from '@/data/budgets'
import { reviews } from '@/data/reviews'
import type { BudgetRange, Product } from '@/types'

const bySlug = new Map(products.map((p) => [p.slug, p]))
const byId = new Map(products.map((p) => [p.id, p]))

export function getAllProducts(): Product[] {
  return products
}

export function getProductBySlug(slug: string): Product | undefined {
  return bySlug.get(slug)
}

export function getProductById(id: string): Product | undefined {
  return byId.get(id)
}

export function getProductsByIds(ids: string[]): Product[] {
  return ids.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p))
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug)
}

export function getByCategory(slug: string): Product[] {
  return products.filter((p) => p.categories.includes(slug))
}

export function totalStock(product: Product): number {
  return product.variants.reduce((sum, v) => sum + v.stock, 0)
}

export function isInStock(product: Product): boolean {
  return totalStock(product) > 0
}

export function getRelated(product: Product, limit = 8): Product[] {
  const score = (p: Product) =>
    (p.subcategory === product.subcategory ? 3 : 0) +
    (p.category === product.category ? 2 : 0) +
    (p.brand === product.brand ? 1 : 0) +
    p.tags.filter((t) => product.tags.includes(t)).length
  return products
    .filter((p) => p.id !== product.id && p.categories.some((c) => product.categories.includes(c)))
    .sort((a, b) => score(b) - score(a) || b.rating - a.rating)
    .slice(0, limit)
}

export function getBestsellers(limit = 12): Product[] {
  return products
    .filter((p) => p.isBestseller)
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, limit)
}

export function getNewArrivals(limit = 8): Product[] {
  return [...products]
    .filter((p) => p.isNew)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit)
}

export function inBudget(price: number, budget: Pick<BudgetRange, 'min' | 'max'>): boolean {
  return price >= budget.min && (budget.max === null || price <= budget.max)
}

export function getByPriceRange(min: number, max: number | null): Product[] {
  return products.filter((p) => inBudget(p.price, { min, max }))
}

export function getBudget(id: string) {
  return budgets.find((b) => b.id === id)
}

export function getReviews(productId: string) {
  return reviews.filter((r) => r.productId === productId)
}

export function getAllBrands(): string[] {
  return [...new Set(products.map((p) => p.brand))].sort()
}
