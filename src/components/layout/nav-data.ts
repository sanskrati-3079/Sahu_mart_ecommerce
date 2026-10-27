import { budgets } from '@/data/budgets'
import { categories, menuCategorySlugs } from '@/data/categories'
import type { Category } from '@/types'

export const menuCategories: Category[] = menuCategorySlugs
  .map((slug) => categories.find((c) => c.slug === slug))
  .filter((c): c is Category => Boolean(c))

export function subcategoryHref(slug: string, sub: string) {
  return `/category/${slug}?sub=${encodeURIComponent(sub)}`
}

export function budgetHref(base: string, b: (typeof budgets)[number]) {
  const sp = new URLSearchParams()
  if (b.min > 0) sp.set('min', String(b.min))
  if (b.max !== null) sp.set('max', String(b.max))
  const qs = sp.toString()
  return `${base}${base.includes('?') ? '&' : '?'}${qs}`
}
