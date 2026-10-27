import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { budgets } from '@/data/budgets'
import { specialLinks } from '@/data/categories'
import { resizeImage } from '@/data/images'
import { getByCategory, inBudget } from '@/lib/catalog'
import { cn } from '@/lib/utils'
import { budgetHref, menuCategories, subcategoryHref } from './nav-data'

/**
 * Desktop category navigation. Hovering (or focusing) a category previews its panel.
 * Keyboard: ArrowDown on a category moves focus into its panel, Escape closes it
 * and returns focus to the category link.
 */
export function MegaMenu() {
  const [openSlug, setOpenSlug] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const triggers = useRef(new Map<string, HTMLAnchorElement>())
  const panelRef = useRef<HTMLDivElement>(null)
  /** Set while focus is being returned to a trigger, so that focus doesn't reopen the panel. */
  const returningFocus = useRef(false)
  const location = useLocation()

  useEffect(() => setOpenSlug(null), [location.pathname, location.search])

  const schedule = (slug: string | null, delay = 120) => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setOpenSlug(slug), delay)
  }

  const focusPanel = () => {
    window.setTimeout(() => panelRef.current?.querySelector<HTMLAnchorElement>('a')?.focus(), 30)
  }

  const closeAndReturn = () => {
    const slug = openSlug
    setOpenSlug(null)
    if (slug) {
      returningFocus.current = true
      triggers.current.get(slug)?.focus()
      returningFocus.current = false
    }
  }

  const active = menuCategories.find((c) => c.slug === openSlug)
  const activeProducts = active ? getByCategory(active.slug) : []
  const activeCount = activeProducts.length
  const activeBudgets = budgets
    .map((budget) => ({ budget, count: activeProducts.filter((p) => inBudget(p.price, budget)).length }))
    .filter((b) => b.count > 0)

  return (
    <nav aria-label="Shop by category" className="relative hidden border-t border-line lg:block" onMouseLeave={() => schedule(null, 150)}>
      <div className="container-page">
        <ul className="scrollbar-none -mx-2 flex items-center justify-between gap-1 overflow-x-auto">
          {menuCategories.map((c) => (
            <li key={c.slug} className="shrink-0">
              <Link
                ref={(el) => {
                  if (el) triggers.current.set(c.slug, el)
                }}
                to={`/category/${c.slug}`}
                aria-expanded={openSlug === c.slug}
                aria-controls="mega-panel"
                onMouseEnter={() => schedule(c.slug)}
                onFocus={() => {
                  if (!returningFocus.current) schedule(c.slug, 0)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setOpenSlug(c.slug)
                    focusPanel()
                  } else if (e.key === 'Escape') setOpenSlug(null)
                }}
                className={cn(
                  'relative block px-1.5 py-3.5 text-[12.5px] font-medium xl:px-2 xl:text-[13px] tracking-[0.02em] whitespace-nowrap text-charcoal transition-colors hover:text-forest',
                  'after:absolute after:inset-x-1.5 xl:after:inset-x-2 after:bottom-0 after:h-[2px] after:origin-left after:scale-x-0 after:bg-forest after:transition-transform after:duration-200',
                  openSlug === c.slug && 'text-forest after:scale-x-100',
                )}
              >
                {c.shortName ?? c.name}
              </Link>
            </li>
          ))}
          {specialLinks.map((l) => (
            <li key={l.href} className="shrink-0">
              <Link
                to={l.href}
                onMouseEnter={() => schedule(null)}
                onFocus={() => setOpenSlug(null)}
                className={cn(
                  'block px-1.5 py-3.5 text-[12.5px] font-semibold whitespace-nowrap transition-colors xl:px-2 xl:text-[13px]',
                  l.label.startsWith('Sale') ? 'text-sale hover:text-charcoal' : 'text-forest hover:text-charcoal',
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            key="panel"
            id="mega-panel"
            ref={panelRef}
            role="region"
            aria-label={`${active.name} menu`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            onMouseEnter={() => window.clearTimeout(timer.current)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.preventDefault()
                closeAndReturn()
              }
            }}
            onBlur={(e) => {
              const next = e.relatedTarget as Node | null
              const inTrigger = next && [...triggers.current.values()].some((t) => t.contains(next))
              if (!panelRef.current?.contains(next) && !inTrigger) setOpenSlug(null)
            }}
            className="absolute inset-x-0 top-full z-40 border-t border-line bg-ivory shadow-lift"
          >
            <div className="container-page grid grid-cols-12 gap-8 py-8">
              <div className="col-span-3">
                <p className="eyebrow mb-4">Shop by type</p>
                <ul className="space-y-2.5">
                  {active.subcategories.map((s) => (
                    <li key={s}>
                      <Link to={subcategoryHref(active.slug, s)} className="text-[14px] text-charcoal hover:text-forest hover:underline">
                        {s}
                      </Link>
                    </li>
                  ))}
                  <li className="pt-1">
                    <Link to={`/category/${active.slug}`} className="inline-flex items-center gap-1 text-[14px] font-medium text-forest">
                      View all {activeCount} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-span-2">
                <p className="eyebrow mb-4">Shop by budget</p>
                <ul className="space-y-2.5">
                  {activeBudgets.map(({ budget: b, count }) => (
                    <li key={b.id}>
                      <Link
                        to={budgetHref(`/category/${active.slug}`, b)}
                        className="text-[14px] text-charcoal hover:text-forest hover:underline"
                      >
                        {b.label} <span className="text-[12px] text-muted">({count})</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-2">
                <p className="eyebrow mb-4">Discover</p>
                <ul className="space-y-2.5">
                  <li>
                    <Link
                      to={`/category/${active.slug}?sort=newest`}
                      className="text-[14px] text-charcoal hover:text-forest hover:underline"
                    >
                      New in {active.shortName ?? active.name}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/category/${active.slug}?sort=bestselling`}
                      className="text-[14px] text-charcoal hover:text-forest hover:underline"
                    >
                      Bestsellers
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/category/${active.slug}?sort=rating`}
                      className="text-[14px] text-charcoal hover:text-forest hover:underline"
                    >
                      Highest rated
                    </Link>
                  </li>
                  <li>
                    <Link to={`/category/${active.slug}?discount=10`} className="text-[14px] text-sale hover:underline">
                      On offer
                    </Link>
                  </li>
                </ul>
              </div>
              <Link
                to={`/category/${active.slug}`}
                className="group col-span-5 grid grid-cols-5 overflow-hidden rounded-lg bg-white shadow-soft"
              >
                <div className="col-span-2 overflow-hidden">
                  <img
                    src={resizeImage(active.image, 500)}
                    alt={active.name}
                    className="h-full max-h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="col-span-3 flex flex-col justify-center p-6">
                  <p className="display text-2xl">{active.name}</p>
                  <p className="mt-2 line-clamp-3 text-sm text-muted">{active.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-forest">
                    Explore the edit <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
