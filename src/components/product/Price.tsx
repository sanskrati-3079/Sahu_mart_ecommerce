import { discountPercent, formatINR } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

interface PriceProps {
  product: Pick<Product, 'price' | 'mrp' | 'priceUnit'>
  size?: 'sm' | 'md' | 'lg'
  showUnit?: boolean
  className?: string
}

export function Price({ product, size = 'sm', showUnit = true, className }: PriceProps) {
  const off = discountPercent(product.price, product.mrp)
  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-2 gap-y-0.5', className)}>
      <span
        className={cn(
          'font-semibold text-charcoal',
          size === 'sm' && 'text-[15px]',
          size === 'md' && 'text-lg',
          size === 'lg' && 'text-[26px] font-medium',
        )}
      >
        {formatINR(product.price)}
        {showUnit && product.priceUnit === 'per metre' && <span className="ml-0.5 text-[0.7em] font-normal text-muted">/metre</span>}
      </span>
      {off > 0 && (
        <>
          <span className={cn('text-muted line-through', size === 'lg' ? 'text-base' : 'text-[13px]')}>
            <span className="sr-only">MRP </span>
            {formatINR(product.mrp)}
          </span>
          <span className={cn('font-semibold text-sale', size === 'lg' ? 'text-base' : 'text-[13px]')}>{off}% off</span>
        </>
      )}
    </div>
  )
}
