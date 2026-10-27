import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Reveal } from './motion'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  action?: { label: string; href: string }
  align?: 'left' | 'center'
  className?: string
  id?: string
  children?: React.ReactNode
}

export function SectionHeading({ eyebrow, title, description, action, align = 'left', className, id, children }: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        'mb-8 flex flex-col gap-4 sm:mb-10',
        align === 'center' ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className={cn(align === 'center' && 'max-w-2xl')}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 id={id} className="display text-[32px] leading-[1.1] sm:text-[40px]">
          {title}
        </h2>
        {description && <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">{description}</p>}
      </div>
      {children}
      {action && (
        <Link to={action.href} className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-forest">
          <span className="link-underline">{action.label}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </Link>
      )}
    </Reveal>
  )
}
