import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Small, consistent label used wherever a feature is simulated for the demo. */
export function DemoNote({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('flex items-start gap-2 rounded-md border border-gold/40 bg-gold/10 px-3 py-2 text-[13px] text-charcoal', className)}>
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" aria-hidden />
      <span>{children}</span>
    </p>
  )
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm bg-gold/15 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-gold-dark uppercase',
        className,
      )}
    >
      Demo
    </span>
  )
}
