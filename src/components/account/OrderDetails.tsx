import { Link } from 'react-router-dom'
import { resizeImage } from '@/data/images'
import { formatDate, formatINR, formatShortDate } from '@/lib/format'
import { PAYMENT_LABELS } from '@/lib/tracking'
import type { Order } from '@/types'

export function OrderLines({ order }: { order: Order }) {
  return (
    <ul className="divide-y divide-line">
      {order.lines.map((l) => (
        <li key={`${l.productId}-${l.color}-${l.size}`} className="flex gap-4 py-4">
          <Link to={`/product/${l.slug}`} className="shrink-0">
            <img src={resizeImage(l.image, 160)} alt={l.name} className="h-20 w-16 rounded-md object-cover" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] tracking-[0.08em] text-muted uppercase">{l.brand}</p>
            <Link to={`/product/${l.slug}`} className="line-clamp-2 text-[14px] hover:text-forest">
              {l.name}
            </Link>
            <p className="text-[13px] text-muted">
              {[l.color, l.size].filter(Boolean).join(' · ')}
              {(l.color || l.size) && ' · '}Qty {l.quantity}
              {l.priceUnit === 'per metre' && ' m'}
            </p>
          </div>
          <p className="text-[14px] font-medium">{formatINR(l.price * l.quantity)}</p>
        </li>
      ))}
    </ul>
  )
}

export function OrderFacts({ order }: { order: Order }) {
  const a = order.address
  return (
    <dl className="grid gap-5 text-[14px] sm:grid-cols-2">
      <div>
        <dt className="text-[12px] font-semibold tracking-[0.12em] text-muted uppercase">Delivery address</dt>
        <dd className="mt-1.5 leading-relaxed">
          {a.fullName}
          <br />
          {a.line1}
          {a.line2 ? `, ${a.line2}` : ''}
          {a.landmark && (
            <>
              <br />
              Landmark: {a.landmark}
            </>
          )}
          <br />
          {a.city}, {a.state} {a.pincode}
          <br />
          +91 {a.phone}
        </dd>
      </div>
      <div className="space-y-4">
        <div>
          <dt className="text-[12px] font-semibold tracking-[0.12em] text-muted uppercase">Estimated delivery</dt>
          <dd className="mt-1.5">
            {formatShortDate(order.estimatedDelivery.from)} – {formatShortDate(order.estimatedDelivery.to)} ·{' '}
            {order.delivery === 'express' ? 'Express' : 'Standard'}
          </dd>
        </div>
        <div>
          <dt className="text-[12px] font-semibold tracking-[0.12em] text-muted uppercase">Payment</dt>
          <dd className="mt-1.5">{PAYMENT_LABELS[order.payment]} — demo, no payment processed</dd>
        </div>
        <div>
          <dt className="text-[12px] font-semibold tracking-[0.12em] text-muted uppercase">Placed on</dt>
          <dd className="mt-1.5">{formatDate(order.createdAt)}</dd>
        </div>
      </div>
    </dl>
  )
}

export function OrderTotals({ order }: { order: Order }) {
  const s = order.summary
  const row = 'flex justify-between py-1 text-[14px]'
  return (
    <dl>
      <div className={row}>
        <dt>Subtotal</dt>
        <dd>{formatINR(s.subtotal)}</dd>
      </div>
      {s.savings > 0 && (
        <div className={row}>
          <dt>Savings on MRP</dt>
          <dd className="text-success">−{formatINR(s.savings)}</dd>
        </div>
      )}
      {order.couponCode && (
        <div className={row}>
          <dt>Coupon ({order.couponCode})</dt>
          <dd className="text-success">{s.couponDiscount > 0 ? `−${formatINR(s.couponDiscount)}` : 'Free shipping'}</dd>
        </div>
      )}
      <div className={row}>
        <dt>Shipping</dt>
        <dd>{s.shipping === 0 ? 'Free' : formatINR(s.shipping)}</dd>
      </div>
      <div className="mt-2 flex justify-between border-t border-line pt-3 text-[16px] font-semibold">
        <dt>Total</dt>
        <dd>{formatINR(s.total)}</dd>
      </div>
    </dl>
  )
}
