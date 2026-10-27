import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'
import { ProductCard } from './ProductCard'

/** Horizontally scrolling product row with previous / next buttons. */
export function ProductRow({ products, label }: { products: Product[]; label: string }) {
  const ref = useRef<HTMLUListElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    update()
    const el = ref.current
    el?.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el?.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [update, products.length])

  const scroll = (dir: 1 | -1) => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: reduce ? 'auto' : 'smooth' })
  }

  const btn =
    'inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-charcoal shadow-soft transition-opacity hover:border-charcoal disabled:pointer-events-none disabled:opacity-30'

  return (
    <div className="relative">
      <div className="mb-4 flex justify-end gap-2">
        <button type="button" className={btn} onClick={() => scroll(-1)} disabled={!canPrev} aria-label={`Scroll ${label} left`}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button type="button" className={btn} onClick={() => scroll(1)} disabled={!canNext} aria-label={`Scroll ${label} right`}>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <ul
        ref={ref}
        aria-label={label}
        className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:-mx-6 sm:gap-6 sm:px-6 lg:mx-0 lg:px-0"
      >
        {products.map((p) => (
          <li key={p.id} className={cn('w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[calc(25%-18px)]')}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </div>
  )
}
