import { findCoupon } from '@/lib/pricing'
import { formatINR, pluralize } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { PriceSummary } from '@/types'

interface OrderSummaryProps {
  summary: PriceSummary
  couponCode?: string
  shippingLabel?: string
  className?: string
  children?: React.ReactNode
  title?: string
}

export function OrderSummary({
  summary,
  couponCode,
  shippingLabel = 'Shipping',
  className,
  children,
  title = 'Order summary',
}: OrderSummaryProps) {
  const coupon = couponCode ? findCoupon(couponCode) : undefined
  const couponInactive = coupon && summary.subtotal < coupon.minSubtotal
  const row = 'flex items-baseline justify-between gap-4 py-1.5 text-[14px]'

  return (
    <div className={cn('rounded-lg border border-line bg-white p-6', className)}>
      <h2 className="font-display text-2xl">{title}</h2>
      <dl className="mt-4">
        <div className={row}>
          <dt>Bag total (MRP) · {pluralize(summary.itemCount, 'item')}</dt>
          <dd>{formatINR(summary.mrpTotal)}</dd>
        </div>
        {summary.savings > 0 && (
          <div className={row}>
            <dt>Savings on MRP</dt>
            <dd className="text-success">−{formatINR(summary.savings)}</dd>
          </div>
        )}
        <div className={cn(row, 'border-t border-line pt-3 mt-1.5')}>
          <dt>Subtotal</dt>
          <dd>{formatINR(summary.subtotal)}</dd>
        </div>
        {coupon && (
          <div className={row}>
            <dt>
              Coupon <span className="rounded-sm bg-sage px-1.5 py-0.5 text-[12px] font-medium text-forest">{coupon.code}</span>
            </dt>
            <dd className={couponInactive ? 'text-muted' : 'text-success'}>
              {couponInactive ? 'Not applied' : coupon.kind === 'shipping' ? 'Free shipping' : `−${formatINR(summary.couponDiscount)}`}
            </dd>
          </div>
        )}
        <div className={row}>
          <dt>{shippingLabel}</dt>
          <dd>{summary.shipping === 0 ? <span className="text-success">Free</span> : formatINR(summary.shipping)}</dd>
        </div>
        <div className="mt-3 flex items-baseline justify-between border-t border-line pt-4">
          <dt className="text-[15px] font-semibold">Total</dt>
          <dd className="text-xl font-semibold">{formatINR(summary.total)}</dd>
        </div>
      </dl>
      <p className="mt-1 text-right text-[12px] text-muted">Inclusive of all taxes</p>
      {couponInactive && coupon && (
        <p className="mt-3 rounded-md bg-gold/10 px-3 py-2 text-[13px]">
          {coupon.code} needs a minimum order of {formatINR(coupon.minSubtotal)}. Add {formatINR(coupon.minSubtotal - summary.subtotal)}{' '}
          more to use it.
        </p>
      )}
      {summary.savings + summary.couponDiscount > 0 && (
        <p className="mt-4 rounded-md bg-sage px-3 py-2 text-center text-[13px] font-medium text-forest">
          You’re saving {formatINR(summary.savings + summary.couponDiscount)} on this order
        </p>
      )}
      {children && <div className="mt-5">{children}</div>}
    </div>
  )
}
