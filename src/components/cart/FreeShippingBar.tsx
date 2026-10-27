import { motion } from 'motion/react'
import { Truck } from 'lucide-react'
import { formatINR } from '@/lib/format'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/pricing'

export function FreeShippingBar({ subtotal, remaining }: { subtotal: number; remaining: number }) {
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  return (
    <div>
      <p className="flex items-center gap-2 text-[13px] text-charcoal">
        <Truck className="h-4 w-4 text-forest" aria-hidden />
        {remaining > 0 ? (
          <span>
            Add <strong>{formatINR(remaining)}</strong> more for free delivery
          </span>
        ) : (
          <span>
            You’ve unlocked <strong>free standard delivery</strong>
          </span>
        )}
      </p>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-label="Progress towards free delivery"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
      >
        <motion.div
          className="h-full rounded-full bg-forest"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}
