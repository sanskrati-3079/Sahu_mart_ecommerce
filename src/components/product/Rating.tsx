import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Stars({ value, className, size = 14 }: { value: number; className?: string; size?: number }) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, value - (i - 1)))
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star className="absolute inset-0 text-line" style={{ width: size, height: size }} fill="currentColor" strokeWidth={0} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="text-gold" style={{ width: size, height: size }} fill="currentColor" strokeWidth={0} />
            </span>
          </span>
        )
      })}
    </span>
  )
}

export function Rating({ value, count, className }: { value: number; count?: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-[12px] text-muted', className)}>
      <Stars value={value} size={13} />
      <span className="font-medium text-charcoal">{value.toFixed(1)}</span>
      {count !== undefined && <span>({count.toLocaleString('en-IN')})</span>}
      <span className="sr-only">
        Rated {value.toFixed(1)} out of 5{count !== undefined ? ` from ${count} reviews` : ''}
      </span>
    </span>
  )
}
