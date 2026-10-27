import { Check, X } from 'lucide-react'
import { formatShortDate } from '@/lib/format'
import { orderStatus, orderTimeline } from '@/lib/tracking'
import { cn } from '@/lib/utils'
import type { Order } from '@/types'

const timeFmt = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' })

export function StatusBadge({ order }: { order: Order }) {
  const { step } = orderStatus(order)
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium',
        step === 'Cancelled' ? 'bg-sale/10 text-sale' : step === 'Delivered' ? 'bg-forest text-ivory' : 'bg-sage text-forest',
      )}
    >
      {step}
    </span>
  )
}

export function OrderTimeline({ order }: { order: Order }) {
  const { index } = orderStatus(order)
  const timeline = orderTimeline(order)

  if (order.cancelledAt) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-sale/30 bg-sale/5 p-4">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sale text-white">
          <X className="h-4 w-4" aria-hidden />
        </span>
        <div>
          <p className="font-medium">Order cancelled</p>
          <p className="text-[13px] text-muted">
            Cancelled on {formatShortDate(order.cancelledAt)} at {timeFmt.format(new Date(order.cancelledAt))}. No payment was taken (demo).
          </p>
        </div>
      </div>
    )
  }

  return (
    <ol className="relative" aria-label="Order progress">
      {timeline.map((t, i) => {
        const done = i <= index
        const current = i === index
        return (
          <li key={t.step} className="relative flex gap-4 pb-7 last:pb-0">
            {i < timeline.length - 1 && (
              <span
                className={cn('absolute top-8 left-[15px] h-[calc(100%-2rem)] w-0.5', i < index ? 'bg-forest' : 'bg-line')}
                aria-hidden
              />
            )}
            <span
              className={cn(
                'relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2',
                done ? 'border-forest bg-forest text-ivory' : 'border-line bg-white text-muted',
                current && 'ring-4 ring-forest/15',
              )}
              aria-hidden
            >
              {done ? <Check className="h-4 w-4" /> : <span className="h-2 w-2 rounded-full bg-line" />}
            </span>
            <div className="pt-1">
              <p className={cn('text-[15px]', done ? 'font-medium text-charcoal' : 'text-muted')}>
                {t.step}
                {current && (
                  <span className="ml-2 rounded-sm bg-sage px-1.5 py-0.5 text-[11px] font-semibold tracking-wide text-forest uppercase">
                    Current
                  </span>
                )}
                <span className="sr-only">{done ? ' — completed' : ' — upcoming'}</span>
              </p>
              <p className="text-[13px] text-muted">
                {done
                  ? `${formatShortDate(new Date(t.at))}, ${timeFmt.format(new Date(t.at))}`
                  : `Expected ${formatShortDate(new Date(t.at))}`}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
