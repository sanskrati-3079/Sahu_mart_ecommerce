import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { Breadcrumbs, type Crumb } from '@/components/Breadcrumbs'
import { StaggerGrid, StaggerItem } from '@/components/motion'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { categories } from '@/data/categories'
import { applyFilters, clearFilters, hasActiveFilters, parseFilters, sortProducts, writeFilters, type FilterState } from '@/lib/filters'
import { pluralize } from '@/lib/format'
import type { Product } from '@/types'
import { ActiveFilterChips } from './ActiveFilterChips'
import { FilterPanel } from './FilterPanel'
import { SortSelect } from './SortSelect'

const PAGE_SIZE = 24

interface ListingLayoutProps {
  title: string
  description?: string
  crumbs: Crumb[]
  base: Product[]
  /** Search relevance (product id → score) used for the "Recommended" sort. */
  relevance?: Map<string, number>
  intro?: React.ReactNode
  aside?: React.ReactNode
  emptyState?: React.ReactNode
}

export function ListingLayout({ title, description, crumbs, base, relevance, intro, aside, emptyState }: ListingLayoutProps) {
  const [sp, setSp] = useSearchParams()
  const filters = useMemo(() => parseFilters(sp), [sp])
  const [mobileOpen, setMobileOpen] = useState(false)
  const [draft, setDraft] = useState<FilterState>(filters)
  const [shownFor, setShownFor] = useState({ key: '', count: PAGE_SIZE })

  const results = useMemo(() => sortProducts(applyFilters(base, filters), filters.sort, relevance), [base, filters, relevance])
  const listKey = sp.toString() + base.length
  const shown = shownFor.key === listKey ? shownFor.count : PAGE_SIZE
  const visible = results.slice(0, shown)

  const update = (next: FilterState) => setSp(writeFilters(sp, next), { preventScrollReset: true })
  const draftCount = useMemo(() => applyFilters(base, draft).length, [base, draft])

  return (
    <div className="container-page pt-6 pb-8">
      <Breadcrumbs items={crumbs} />
      <header className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <h1 className="display text-[36px] leading-tight sm:text-[48px]">{title}</h1>
          {description && <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{description}</p>}
          {intro}
        </div>
        {aside && <div className="lg:col-span-4">{aside}</div>}
      </header>

      {base.length === 0 && emptyState ? (
        <div className="mt-8">{emptyState}</div>
      ) : (
        <>
          <div className="sticky top-16 z-30 -mx-4 mt-8 border-y border-line bg-ivory/95 px-4 py-3 sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-x-0 lg:bg-transparent lg:px-0">
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => {
                  setDraft(filters)
                  setMobileOpen(true)
                }}
              >
                <SlidersHorizontal aria-hidden /> Filters{' '}
                {hasActiveFilters(filters) && <span className="rounded-full bg-forest px-1.5 text-[11px] text-ivory">on</span>}
              </Button>
              <p className="hidden text-[13px] text-muted lg:block" aria-live="polite">
                Showing <strong className="text-charcoal">{visible.length}</strong> of{' '}
                <strong className="text-charcoal">{pluralize(results.length, 'product')}</strong>
              </p>
              <SortSelect
                value={filters.sort}
                onChange={(sort) => update({ ...filters, sort })}
                relevanceLabel={relevance ? 'Most relevant' : undefined}
              />
            </div>
          </div>
          <p className="mt-3 text-[13px] text-muted lg:hidden" aria-live="polite">
            Showing <strong className="text-charcoal">{visible.length}</strong> of {pluralize(results.length, 'product')}
          </p>

          <div className="mt-6 grid gap-10 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr]">
            <aside aria-label="Filters" className="hidden lg:block">
              <div className="sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto pr-3 pb-6">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <h2 className="text-[13px] font-semibold tracking-[0.16em] uppercase">Filters</h2>
                  {hasActiveFilters(filters) && (
                    <button
                      type="button"
                      onClick={() => update(clearFilters(filters))}
                      className="text-[13px] text-forest underline underline-offset-4"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <FilterPanel base={base} filters={filters} onChange={update} />
              </div>
            </aside>

            <section aria-label="Products">
              <ActiveFilterChips filters={filters} onChange={update} />
              {results.length === 0 ? (
                (emptyState ?? <NoMatches onClear={() => update(clearFilters(filters))} />)
              ) : (
                <>
                  <StaggerGrid key={listKey} className="mt-6 grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 xl:grid-cols-4">
                    {visible.map((p, i) => (
                      <StaggerItem key={p.id}>
                        <ProductCard product={p} priority={i < 4} />
                      </StaggerItem>
                    ))}
                  </StaggerGrid>
                  <div className="mt-14 flex flex-col items-center gap-4">
                    <p className="text-[13px] text-muted">
                      You’ve viewed {visible.length} of {pluralize(results.length, 'product')}
                    </p>
                    <div className="h-1 w-48 overflow-hidden rounded-full bg-line" aria-hidden>
                      <div className="h-full bg-forest" style={{ width: `${(visible.length / results.length) * 100}%` }} />
                    </div>
                    {visible.length < results.length && (
                      <Button variant="secondary" onClick={() => setShownFor({ key: listKey, count: shown + PAGE_SIZE })}>
                        Load more
                      </Button>
                    )}
                  </div>
                </>
              )}
            </section>
          </div>
        </>
      )}

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="bottom" className="flex flex-col">
          <div className="flex h-14 shrink-0 items-center border-b border-line px-5">
            <SheetTitle className="text-[15px] font-semibold">Filters</SheetTitle>
            <SheetDescription className="sr-only">Refine products, then apply</SheetDescription>
          </div>
          <div className="flex-1 overflow-y-auto px-5">
            <FilterPanel base={base} filters={draft} onChange={setDraft} />
          </div>
          <div className="grid shrink-0 grid-cols-2 gap-3 border-t border-line bg-white px-5 py-4">
            <Button variant="outline" onClick={() => setDraft(clearFilters(draft))}>
              Clear all
            </Button>
            <Button
              onClick={() => {
                update(draft)
                setMobileOpen(false)
              }}
            >
              Show {draftCount} {draftCount === 1 ? 'product' : 'products'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function NoMatches({ onClear }: { onClear: () => void }) {
  return (
    <div className="mt-10 rounded-lg border border-dashed border-line bg-white px-6 py-14 text-center">
      <p className="display text-2xl">Nothing matches those filters — yet</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">
        Try removing a filter or widening your price range. Or explore a popular category below.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button onClick={onClear}>Clear all filters</Button>
        <Button asChild variant="secondary">
          <Link to="/shop">Browse everything</Link>
        </Button>
      </div>
      <ul className="mt-8 flex flex-wrap justify-center gap-2">
        {categories.slice(0, 6).map((c) => (
          <li key={c.slug}>
            <Link
              to={`/category/${c.slug}`}
              className="inline-block rounded-full border border-line px-3.5 py-1.5 text-[13px] hover:border-forest hover:text-forest"
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
