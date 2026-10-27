import { DemoBadge } from '@/components/ui/demo-note'
import { getReviews } from '@/lib/catalog'
import { formatDate } from '@/lib/format'
import type { Product } from '@/types'
import { Stars } from './Rating'

export function Reviews({ product }: { product: Product }) {
  const list = getReviews(product.id)
  const average = list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : product.rating
  const bars = [5, 4, 3, 2, 1].map((star) => ({ star, count: list.filter((r) => r.rating === star).length }))

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="scroll-mt-32 border-t border-line pt-14">
      <div className="flex flex-wrap items-center gap-3">
        <h2 id="reviews-title" className="display text-[32px]">
          Customer reviews
        </h2>
        <DemoBadge />
      </div>
      <p className="mt-1 text-[13px] text-muted">Sample reviews (demo) — written for illustration, not by real customers.</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[300px_1fr]">
        <div>
          <p className="font-display text-6xl text-charcoal">{average.toFixed(1)}</p>
          <Stars value={average} size={18} className="mt-2" />
          <p className="mt-2 text-[13px] text-muted">
            {list.length
              ? `Based on ${list.length} sample reviews`
              : `Rated ${product.rating.toFixed(1)} from ${product.reviewCount.toLocaleString('en-IN')} ratings (demo)`}
          </p>
          {list.length > 0 && (
            <ul className="mt-6 space-y-2" aria-label="Rating breakdown">
              {bars.map((b) => (
                <li key={b.star} className="flex items-center gap-3 text-[13px]">
                  <span className="w-8 shrink-0">{b.star} ★</span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                    <span className="block h-full rounded-full bg-gold" style={{ width: `${(b.count / list.length) * 100}%` }} />
                  </span>
                  <span className="w-6 text-right text-muted tabular-nums">{b.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {list.length ? (
          <ul className="divide-y divide-line">
            {list.map((r) => (
              <li key={r.id} className="py-6 first:pt-0">
                <div className="flex flex-wrap items-center gap-3">
                  <Stars value={r.rating} />
                  <p className="text-[15px] font-medium">{r.title}</p>
                </div>
                <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-charcoal/85">{r.body}</p>
                <p className="mt-3 text-[12px] text-muted">
                  {r.author}, {r.city} · {formatDate(r.date)} · Sample review
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-lg border border-dashed border-line bg-white p-8 text-center">
            <p className="font-medium">No written reviews yet</p>
            <p className="mt-1 text-sm text-muted">Written sample reviews are shown for selected products in this demo.</p>
          </div>
        )}
      </div>
    </section>
  )
}
