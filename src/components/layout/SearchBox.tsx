import { Fragment, useEffect, useId, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Clock, Search, TrendingUp, X } from 'lucide-react'
import { resizeImage } from '@/data/images'
import { formatINR } from '@/lib/format'
import { matchCategories, POPULAR_SEARCHES, searchProducts } from '@/lib/search'
import { cn } from '@/lib/utils'
import { useDebounced } from '@/hooks/useDebounced'
import { usePreferences } from '@/store/preferences'

type Option =
  | { kind: 'product'; id: string; label: string; href: string; image: string; price: number }
  | { kind: 'category'; id: string; label: string; href: string }
  | { kind: 'query'; id: string; label: string; recent: boolean }

interface SearchBoxProps {
  className?: string
  autoFocus?: boolean
  onNavigate?: () => void
}

export function SearchBox({ className, autoFocus, onNavigate }: SearchBoxProps) {
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const debounced = useDebounced(value, 120)
  const navigate = useNavigate()
  const listId = useId()
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { recentSearches, addSearch, clearSearches } = usePreferences()

  const { products, cats } = useMemo(() => {
    const q = debounced.trim()
    if (!q) return { products: [] as Option[], cats: [] as Option[] }
    const { results } = searchProducts(q)
    return {
      products: results.slice(0, 5).map<Option>((r) => ({
        kind: 'product',
        id: r.product.id,
        label: r.product.name,
        href: `/product/${r.product.slug}`,
        image: r.product.images[0],
        price: r.product.price,
      })),
      cats: matchCategories(q).map<Option>((c) => ({ kind: 'category', id: c.slug, label: c.name, href: `/category/${c.slug}` })),
    }
  }, [debounced])

  const idle = !value.trim()
  const idleOptions: Option[] = useMemo(
    () => [
      ...recentSearches.map<Option>((q) => ({ kind: 'query', id: `r-${q}`, label: q, recent: true })),
      ...POPULAR_SEARCHES.filter((p) => !recentSearches.some((r) => r.toLowerCase() === p.toLowerCase())).map<Option>((q) => ({
        kind: 'query',
        id: `p-${q}`,
        label: q,
        recent: false,
      })),
    ],
    [recentSearches],
  )
  const options = idle ? idleOptions : [...cats, ...products]

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const go = (href: string) => {
    setOpen(false)
    setActive(-1)
    inputRef.current?.blur()
    onNavigate?.()
    navigate(href)
  }

  const submit = (q: string) => {
    const term = q.trim()
    if (!term) return
    addSearch(term)
    setValue(term)
    go(`/search?q=${encodeURIComponent(term)}`)
  }

  const choose = (o: Option) => {
    if (o.kind === 'query') return submit(o.label)
    if (value.trim()) addSearch(value.trim())
    go(o.href)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActive((i) => (options.length ? (i + 1) % options.length : -1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (options.length ? (i <= 0 ? options.length - 1 : i - 1) : -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (open && active >= 0 && options[active]) choose(options[active])
      else submit(value)
    } else if (e.key === 'Escape') {
      if (open) {
        e.preventDefault()
        setOpen(false)
        setActive(-1)
      } else if (value) setValue('')
    }
  }

  const optionId = (i: number) => `${listId}-opt-${i}`
  const showPanel = open && (idle ? idleOptions.length > 0 : true)

  return (
    <div ref={wrapRef} className={cn('relative', className)}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          submit(value)
        }}
      >
        <label htmlFor={`${listId}-input`} className="sr-only">
          Search Sahu Marts
        </label>
        <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
        <input
          id={`${listId}-input`}
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? optionId(active) : undefined}
          autoComplete="off"
          autoFocus={autoFocus}
          enterKeyHint="search"
          value={value}
          placeholder="Search sarees, jhumkas, trolley bags…"
          onChange={(e) => {
            setValue(e.target.value)
            setOpen(true)
            setActive(-1)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="h-11 w-full rounded-md border border-line bg-white pr-10 pl-10 text-[14px] placeholder:text-muted/90 focus:border-forest focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-forest/30 [&::-webkit-search-cancel-button]:hidden"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setValue('')
              setActive(-1)
              inputRef.current?.focus()
            }}
            className="absolute top-1/2 right-2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:bg-sage hover:text-charcoal"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-x-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-lg border border-line bg-white p-2 shadow-lift"
          >
            <ul id={listId} role="listbox" aria-label="Search suggestions">
              {idle ? (
                <>
                  {recentSearches.length > 0 && (
                    <li role="presentation" className="flex items-center justify-between px-3 pt-2 pb-1">
                      <span className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">Recent searches</span>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={clearSearches}
                        className="text-[12px] text-forest underline-offset-2 hover:underline"
                      >
                        Clear
                      </button>
                    </li>
                  )}
                  {idleOptions.map((o, i) => (
                    <Fragment key={o.id}>
                      {i === recentSearches.length && (
                        <li role="presentation" className="px-3 pt-3 pb-1 text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
                          Popular searches
                        </li>
                      )}
                      <SuggestionRow id={optionId(i)} option={o} active={active === i} onChoose={choose} onHover={() => setActive(i)} />
                    </Fragment>
                  ))}
                </>
              ) : options.length ? (
                <>
                  {cats.length > 0 && (
                    <li role="presentation" className="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
                      Categories
                    </li>
                  )}
                  {options.map((o, i) => (
                    <Fragment key={o.id}>
                      {i === cats.length && products.length > 0 && (
                        <li role="presentation" className="px-3 pt-3 pb-1 text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
                          Products
                        </li>
                      )}
                      <SuggestionRow id={optionId(i)} option={o} active={active === i} onChoose={choose} onHover={() => setActive(i)} />
                    </Fragment>
                  ))}
                  <li role="presentation" className="mt-1 border-t border-line px-1 pt-1">
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => submit(value)}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm font-medium text-forest hover:bg-sage"
                    >
                      See all results for “{value.trim()}”
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </button>
                  </li>
                </>
              ) : (
                <li role="presentation" className="px-3 py-4 text-sm text-muted">
                  No quick matches. Press Enter to search, or try{' '}
                  <Link to="/category/sarees" className="text-forest underline" onClick={() => setOpen(false)}>
                    Sarees
                  </Link>
                  .
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SuggestionRow({
  id,
  option,
  active,
  onChoose,
  onHover,
}: {
  id: string
  option: Option
  active: boolean
  onChoose: (o: Option) => void
  onHover: () => void
}) {
  return (
    <li
      id={id}
      role="option"
      aria-selected={active}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => onChoose(option)}
      onMouseEnter={onHover}
      className={cn('flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm', active && 'bg-sage')}
    >
      {option.kind === 'product' && (
        <>
          <img src={resizeImage(option.image, 96)} alt="" className="h-12 w-10 shrink-0 rounded-sm object-cover" loading="lazy" />
          <span className="min-w-0 flex-1">
            <span className="line-clamp-1 text-charcoal">{option.label}</span>
            <span className="text-[13px] font-medium text-forest">{formatINR(option.price)}</span>
          </span>
        </>
      )}
      {option.kind === 'category' && (
        <>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-sage text-forest">
            <Search className="h-3.5 w-3.5" aria-hidden />
          </span>
          <span className="flex-1">
            <span className="text-charcoal">{option.label}</span>
            <span className="ml-2 text-[12px] text-muted">Category</span>
          </span>
        </>
      )}
      {option.kind === 'query' && (
        <>
          {option.recent ? (
            <Clock className="h-4 w-4 shrink-0 text-muted" aria-hidden />
          ) : (
            <TrendingUp className="h-4 w-4 shrink-0 text-muted" aria-hidden />
          )}
          <span className="flex-1 text-charcoal">{option.label}</span>
        </>
      )}
    </li>
  )
}
