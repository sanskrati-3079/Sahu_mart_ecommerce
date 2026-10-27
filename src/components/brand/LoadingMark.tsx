import { cn } from '@/lib/utils'

/** Animated monogram used for page-level loading states. */
export function LoadingMark({ className, label = 'Loading' }: { className?: string; label?: string }) {
  return (
    <div role="status" aria-live="polite" className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <svg viewBox="0 0 40 40" className="h-14 w-14" aria-hidden="true">
        <path
          d="M14.5 13V10.5a5.5 5.5 0 0 1 11 0V13"
          fill="none"
          stroke="#C5A46D"
          strokeWidth="1.6"
          strokeLinecap="round"
          style={{ animation: 'handle-pulse 1.4s ease-in-out infinite' }}
        />
        <rect x="7" y="13" width="26" height="22" rx="2.5" fill="#173F35" />
        <path
          d="M24.2 19.2c-.4-1.5-2-2.4-4.1-2.4-2.4 0-4 1.2-4 3 0 4.2 8.3 2.6 8.3 6.8 0 1.9-1.8 3.2-4.3 3.2-2.3 0-4-1-4.4-2.7"
          fill="none"
          stroke="#FAF8F3"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeDasharray="40"
          style={{ animation: 'draw-s 1.4s ease-in-out infinite alternate' }}
        />
        <path d="M11 31.5h18" stroke="#C5A46D" strokeWidth=".8" strokeLinecap="round" />
      </svg>
      <span className="text-[11px] font-semibold tracking-[0.3em] text-forest">SAHU MARTS</span>
      <span className="sr-only">{label}…</span>
    </div>
  )
}

export function PageLoader() {
  return <LoadingMark className="min-h-[60vh]" />
}
