import { X } from 'lucide-react'
import { clearFilters, priceLabel, FACET_LABELS, hasActiveFilters, MULTI_KEYS, type FilterState } from '@/lib/filters'

export function ActiveFilterChips({ filters, onChange }: { filters: FilterState; onChange: (f: FilterState) => void }) {
  if (!hasActiveFilters(filters)) return null
  const chips: { key: string; label: string; remove: () => void }[] = []
  if (filters.min !== undefined || filters.max !== undefined)
    chips.push({
      key: 'price',
      label: priceLabel(filters.min, filters.max),
      remove: () => onChange({ ...filters, min: undefined, max: undefined }),
    })
  for (const k of MULTI_KEYS)
    for (const v of filters[k])
      chips.push({
        key: `${k}-${v}`,
        label: k === 'sub' ? v : `${FACET_LABELS[k].split(' ')[0]}: ${v}`,
        remove: () => onChange({ ...filters, [k]: filters[k].filter((x) => x !== v) }),
      })
  if (filters.rating)
    chips.push({ key: 'rating', label: `${filters.rating}★ & above`, remove: () => onChange({ ...filters, rating: undefined }) })
  if (filters.inStock) chips.push({ key: 'stock', label: 'In stock', remove: () => onChange({ ...filters, inStock: false }) })
  if (filters.discount)
    chips.push({ key: 'discount', label: `${filters.discount}% off or more`, remove: () => onChange({ ...filters, discount: undefined }) })

  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      {chips.map((c) => (
        <li key={c.key}>
          <button
            type="button"
            onClick={c.remove}
            className="inline-flex items-center gap-1.5 rounded-full border border-forest/30 bg-sage px-3 py-1.5 text-[12px] text-forest transition-colors hover:border-forest"
            aria-label={`Remove filter ${c.label}`}
          >
            {c.label}
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={() => onChange(clearFilters(filters))}
          className="px-2 text-[13px] font-medium text-charcoal underline underline-offset-4 hover:text-forest"
        >
          Clear all
        </button>
      </li>
    </ul>
  )
}
