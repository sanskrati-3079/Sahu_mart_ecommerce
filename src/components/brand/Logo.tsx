import { cn } from '@/lib/utils'

interface MonogramProps {
  tone?: 'dark' | 'light'
  className?: string
  title?: string
}

/**
 * The Sahu Marts monogram: a minimal shopping bag with a hand-drawn "S",
 * a thin gold handle and a gold base line.
 */
export function Monogram({ tone = 'dark', className, title }: MonogramProps) {
  const bag = tone === 'dark' ? '#173F35' : '#FAF8F3'
  const letter = tone === 'dark' ? '#FAF8F3' : '#173F35'
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn('h-9 w-9 shrink-0', className)}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d="M14.5 13V10.5a5.5 5.5 0 0 1 11 0V13" fill="none" stroke="#C5A46D" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="7" y="13" width="26" height="22" rx="2.5" fill={bag} />
      <path
        d="M24.2 19.2c-.4-1.5-2-2.4-4.1-2.4-2.4 0-4 1.2-4 3 0 4.2 8.3 2.6 8.3 6.8 0 1.9-1.8 3.2-4.3 3.2-2.3 0-4-1-4.4-2.7"
        fill="none"
        stroke={letter}
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path d="M11 31.5h18" stroke="#C5A46D" strokeWidth=".8" strokeLinecap="round" />
    </svg>
  )
}

interface LogoProps {
  variant?: 'full' | 'icon'
  tone?: 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showTagline?: boolean
}

const sizes = {
  sm: { mark: 'h-7 w-7', word: 'text-[13px] tracking-[0.26em]' },
  md: { mark: 'h-9 w-9', word: 'text-[15px] tracking-[0.3em]' },
  lg: { mark: 'h-12 w-12', word: 'text-xl tracking-[0.32em]' },
}

export function Logo({ variant = 'full', tone = 'dark', size = 'md', className, showTagline }: LogoProps) {
  const s = sizes[size]
  if (variant === 'icon') return <Monogram tone={tone} className={cn(s.mark, className)} title="Sahu Marts" />
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <Monogram tone={tone} className={s.mark} />
      <span className="flex flex-col leading-none">
        <span className={cn('font-sans font-semibold whitespace-nowrap', s.word, tone === 'dark' ? 'text-forest' : 'text-ivory')}>
          SAHU MARTS
        </span>
        {showTagline && (
          <span className={cn('mt-1.5 text-[11px] tracking-wide', tone === 'dark' ? 'text-muted' : 'text-ivory/75')}>
            Everything You Love. All in One Place.
          </span>
        )}
      </span>
    </span>
  )
}
