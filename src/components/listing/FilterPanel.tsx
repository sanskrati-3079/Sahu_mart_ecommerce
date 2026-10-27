import { useEffect, useId, useState } from 'react'
import { Check, Star } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Slider } from '@/components/ui/slider'
import { Swatch } from '@/components/product/VariantSelector'
import { budgets } from '@/data/budgets'
import { isInStock } from '@/lib/catalog'
import {
  activeBudgetId,
  applyFilters,
  buildFacets,
  countWith,
  FACET_LABELS,
  priceBounds,
  type FilterState,
  type MultiKey,
} from '@/lib/filters'
import { discountPercent } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

interface FilterPanelProps {
  base: Product[]
  filters: FilterState
  onChange: (next: FilterState) => void
  /** Hide the subcategory facet (e.g. when it would only show one option). */
  className?: string
}

function CheckRow({
  checked,
  onToggle,
  label,
  count,
  children,
  type = 'checkbox',
  name,
}: {
  checked: boolean
  onToggle: () => void
  label: string
  count: number
  children?: React.ReactNode
  type?: 'checkbox' | 'radio'
  name?: string
}) {
  const id = useId()
  const disabled = count === 0 && !checked
  return (
    <li>
      <label
        htmlFor={id}
        className={cn(
          'flex cursor-pointer items-center gap-3 rounded-md py-1.5 text-[14px] text-charcoal',
          disabled && 'cursor-not-allowed opacity-45',
        )}
      >
        <input id={id} type={type} name={name} checked={checked} onChange={onToggle} disabled={disabled} className="peer sr-only" />
        <span
          className={cn(
            'inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-forest',
            type === 'radio' ? 'rounded-full' : 'rounded-[4px]',
            checked ? 'border-forest bg-forest text-ivory' : 'border-charcoal/30 bg-white',
          )}
          aria-hidden
        >
          {checked &&
            (type === 'radio' ? <span className="h-1.5 w-1.5 rounded-full bg-ivory" /> : <Check className="h-3 w-3" strokeWidth={3} />)}
        </span>
        {children}
        <span className="flex-1">{label}</span>
        <span className="text-[12px] text-muted tabular-nums">{count}</span>
      </label>
    </li>
  )
}

function PriceFilter({ base, filters, onChange }: FilterPanelProps) {
  const [lo, hi] = priceBounds(base)
  const current: [number, number] = [filters.min ?? lo, filters.max ?? hi]
  const [draft, setDraft] = useState<[number, number]>(current)
  const [minText, setMinText] = useState(String(current[0]))
  const [maxText, setMaxText] = useState(String(current[1]))

  useEffect(() => {
    setDraft([filters.min ?? lo, filters.max ?? hi])
    setMinText(String(filters.min ?? lo))
    setMaxText(String(filters.max ?? hi))
  }, [filters.min, filters.max, lo, hi])

  const commit = (a: number, b: number) => {
    const min = Math.max(lo, Math.min(a, b))
    const max = Math.min(hi, Math.max(a, b))
    onChange({ ...filters, min: min <= lo ? undefined : min, max: max >= hi ? undefined : max })
  }

  const budgetId = activeBudgetId(filters)
  const step = hi - lo > 5000 ? 100 : 50

  return (
    <div>
      <Slider
        min={lo}
        max={hi}
        step={step}
        value={draft}
        minStepsBetweenThumbs={1}
        onValueChange={(v) => {
          setDraft([v[0], v[1]])
          setMinText(String(v[0]))
          setMaxText(String(v[1]))
        }}
        onValueCommit={(v) => commit(v[0], v[1])}
        thumbLabels={['Minimum price', 'Maximum price']}
      />
      <form
        className="mt-3 flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          commit(Number(minText) || lo, Number(maxText) || hi)
        }}
      >
        <label className="flex-1">
          <span className="sr-only">Minimum price in rupees</span>
          <span className="flex h-9 items-center rounded-md border border-line bg-white px-2.5 text-[13px] focus-within:border-forest">
            ₹
            <input
              inputMode="numeric"
              value={minText}
              onChange={(e) => setMinText(e.target.value.replace(/\D/g, ''))}
              onBlur={() => commit(Number(minText) || lo, Number(maxText) || hi)}
              className="ml-1 w-full bg-transparent focus:outline-none"
            />
          </span>
        </label>
        <span className="text-muted" aria-hidden>
          –
        </span>
        <label className="flex-1">
          <span className="sr-only">Maximum price in rupees</span>
          <span className="flex h-9 items-center rounded-md border border-line bg-white px-2.5 text-[13px] focus-within:border-forest">
            ₹
            <input
              inputMode="numeric"
              value={maxText}
              onChange={(e) => setMaxText(e.target.value.replace(/\D/g, ''))}
              onBlur={() => commit(Number(minText) || lo, Number(maxText) || hi)}
              className="ml-1 w-full bg-transparent focus:outline-none"
            />
          </span>
        </label>
        <button type="submit" className="sr-only">
          Apply price
        </button>
      </form>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Budget ranges">
        {budgets.map((b) => {
          const count = countWith(base, filters, { min: b.min || undefined, max: b.max ?? undefined })
          const active = budgetId === b.id
          return (
            <li key={b.id}>
              <button
                type="button"
                aria-pressed={active}
                disabled={!count && !active}
                onClick={() =>
                  onChange(
                    active
                      ? { ...filters, min: undefined, max: undefined }
                      : { ...filters, min: b.min || undefined, max: b.max ?? undefined },
                  )
                }
                className={cn(
                  'rounded-full border px-3 py-1.5 text-[12px] transition-colors disabled:opacity-40',
                  active ? 'border-forest bg-forest text-ivory' : 'border-line bg-white text-charcoal hover:border-forest',
                )}
              >
                {b.label} <span className={active ? 'text-ivory/80' : 'text-muted'}>({count})</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function FilterPanel({ base, filters, onChange, className }: FilterPanelProps) {
  const facets = buildFacets(base, filters)
  const toggle = (key: MultiKey, value: string) => {
    const list = filters[key]
    onChange({ ...filters, [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] })
  }
  const show = (key: MultiKey) => facets[key].length > 1 || (key === 'size' && facets.size.length > 0)
  const visible = (['sub', 'brand', 'color', 'size', 'material', 'occasion'] as MultiKey[]).filter(show)
  const anyDiscount = base.some((p) => discountPercent(p.price, p.mrp) > 0)
  const anyOut = base.some((p) => !isInStock(p))
  const inStockCount = applyFilters(base, { ...filters, inStock: true }, 'stock').length

  return (
    <div className={className}>
      <Accordion type="multiple" defaultValue={['price', ...visible.slice(0, 3), 'rating']}>
        <AccordionItem value="price">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent>
            <PriceFilter base={base} filters={filters} onChange={onChange} />
          </AccordionContent>
        </AccordionItem>

        {visible.map((key) => (
          <AccordionItem key={key} value={key}>
            <AccordionTrigger>
              <span>
                {FACET_LABELS[key]}
                {filters[key].length > 0 && <span className="ml-2 text-[12px] font-normal text-forest">({filters[key].length})</span>}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              {key === 'color' ? (
                <ul className="grid grid-cols-1 gap-0.5">
                  {facets.color.map((o) => (
                    <CheckRow
                      key={o.value}
                      label={o.value}
                      count={o.count}
                      checked={filters.color.includes(o.value)}
                      onToggle={() => toggle('color', o.value)}
                    >
                      {o.color && <Swatch hex={o.color.hex} className="h-4 w-4" />}
                    </CheckRow>
                  ))}
                </ul>
              ) : key === 'size' ? (
                <ul className="flex flex-wrap gap-2">
                  {facets.size.map((o) => {
                    const active = filters.size.includes(o.value)
                    return (
                      <li key={o.value}>
                        <button
                          type="button"
                          aria-pressed={active}
                          disabled={!o.count && !active}
                          onClick={() => toggle('size', o.value)}
                          className={cn(
                            'h-9 min-w-11 rounded-md border px-2.5 text-[12px] transition-colors disabled:opacity-35',
                            active ? 'border-forest bg-forest text-ivory' : 'border-line bg-white hover:border-charcoal',
                          )}
                        >
                          {o.value}
                          <span className="sr-only"> ({o.count} products)</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <ul className="space-y-0.5">
                  {facets[key].map((o) => (
                    <CheckRow
                      key={o.value}
                      label={o.value}
                      count={o.count}
                      checked={filters[key].includes(o.value)}
                      onToggle={() => toggle(key, o.value)}
                    />
                  ))}
                </ul>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}

        <AccordionItem value="rating">
          <AccordionTrigger>Customer rating</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-0.5">
              {[4.5, 4, 3.5].map((r) => (
                <CheckRow
                  key={r}
                  type="radio"
                  name="rating"
                  label={`${r} & above`}
                  count={countWith(base, filters, { rating: r })}
                  checked={filters.rating === r}
                  onToggle={() => onChange({ ...filters, rating: filters.rating === r ? undefined : r })}
                >
                  <Star className="h-4 w-4 fill-gold text-gold" aria-hidden />
                </CheckRow>
              ))}
            </ul>
            {filters.rating && (
              <button
                type="button"
                onClick={() => onChange({ ...filters, rating: undefined })}
                className="mt-2 text-[13px] text-forest underline"
              >
                Any rating
              </button>
            )}
          </AccordionContent>
        </AccordionItem>

        {anyOut && (
          <AccordionItem value="stock">
            <AccordionTrigger>Availability</AccordionTrigger>
            <AccordionContent>
              <ul>
                <CheckRow
                  label="In stock only"
                  count={inStockCount}
                  checked={filters.inStock}
                  onToggle={() => onChange({ ...filters, inStock: !filters.inStock })}
                />
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}

        {anyDiscount && (
          <AccordionItem value="discount">
            <AccordionTrigger>Discount</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-0.5">
                {[10, 20, 30, 40].map((d) => (
                  <CheckRow
                    key={d}
                    type="radio"
                    name="discount"
                    label={`${d}% off or more`}
                    count={countWith(base, filters, { discount: d })}
                    checked={filters.discount === d}
                    onToggle={() => onChange({ ...filters, discount: filters.discount === d ? undefined : d })}
                  />
                ))}
              </ul>
              {filters.discount && (
                <button
                  type="button"
                  onClick={() => onChange({ ...filters, discount: undefined })}
                  className="mt-2 text-[13px] text-forest underline"
                >
                  Any discount
                </button>
              )}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  )
}
