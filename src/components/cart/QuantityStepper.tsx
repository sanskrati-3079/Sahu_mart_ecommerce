import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuantityStepperProps {
  value: number
  max: number
  onChange: (value: number) => void
  label: string
  size?: 'sm' | 'md'
  className?: string
}

export function QuantityStepper({ value, max, onChange, label, size = 'sm', className }: QuantityStepperProps) {
  const h = size === 'sm' ? 'h-9' : 'h-12'
  const w = size === 'sm' ? 'w-9' : 'w-11'
  return (
    <div className={cn('inline-flex items-center rounded-md border border-line bg-white', h, className)} role="group" aria-label={label}>
      <button
        type="button"
        className={cn('inline-flex h-full items-center justify-center text-charcoal disabled:opacity-30', w)}
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className={cn('min-w-8 text-center text-sm font-medium tabular-nums')} aria-live="polite" aria-label={`Quantity ${value}`}>
        {value}
      </span>
      <button
        type="button"
        className={cn('inline-flex h-full items-center justify-center text-charcoal disabled:opacity-30', w)}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
