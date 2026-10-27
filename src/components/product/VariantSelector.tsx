import { cn } from '@/lib/utils'
import { colorStock, sizeLabel, sizeStock } from '@/lib/variants'
import type { Product } from '@/types'

interface VariantSelectorProps {
  product: Product
  color?: string
  size?: string
  onColor: (c: string) => void
  onSize: (s: string) => void
  idPrefix: string
  showError?: boolean
  sizeGuideSlot?: React.ReactNode
}

export function Swatch({ hex, className }: { hex: string; className?: string }) {
  return <span className={cn('inline-block rounded-full border border-charcoal/15', className)} style={{ background: hex }} aria-hidden />
}

export function VariantSelector({ product, color, size, onColor, onSize, idPrefix, showError, sizeGuideSlot }: VariantSelectorProps) {
  return (
    <div className="space-y-6">
      {product.colors.length > 0 && (
        <fieldset>
          <legend className="mb-3 text-[13px] text-charcoal">
            <span className="font-medium">Colour:</span> <span className="text-muted">{color ?? 'Select a colour'}</span>
          </legend>
          <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Colour">
            {product.colors.map((c) => {
              const out = colorStock(product, c.name) === 0
              const selected = color === c.name
              return (
                <button
                  key={c.name}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={`${c.name}${out ? ' (out of stock)' : ''}`}
                  disabled={out}
                  onClick={() => onColor(c.name)}
                  className={cn(
                    'relative inline-flex h-10 w-10 items-center justify-center rounded-full border-2 transition-[border-color,transform]',
                    selected ? 'border-forest' : 'border-transparent hover:border-line',
                    out && 'cursor-not-allowed opacity-40',
                  )}
                  title={c.name}
                >
                  <Swatch hex={c.hex} className="h-7 w-7" />
                  {out && <span className="absolute h-[2px] w-9 rotate-45 bg-charcoal/60" aria-hidden />}
                </button>
              )
            })}
          </div>
        </fieldset>
      )}

      {product.sizes.length > 0 && (
        <fieldset>
          <div className="mb-3 flex items-center justify-between">
            <legend className="text-[13px] text-charcoal">
              <span className="font-medium">{sizeLabel(product)}:</span> <span className="text-muted">{size ?? 'Select'}</span>
            </legend>
            {sizeGuideSlot}
          </div>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={sizeLabel(product)}>
            {product.sizes.map((s) => {
              const out = sizeStock(product, s, product.colors.length ? color : undefined) === 0
              const selected = size === s
              return (
                <button
                  key={s}
                  id={`${idPrefix}-size-${s}`}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={`${s}${out ? ' (out of stock)' : ''}`}
                  disabled={out}
                  onClick={() => onSize(s)}
                  className={cn(
                    'relative h-11 min-w-12 rounded-md border px-3.5 text-[13px] font-medium transition-colors',
                    selected ? 'border-forest bg-forest text-ivory' : 'border-line bg-white text-charcoal hover:border-charcoal',
                    out && 'cursor-not-allowed border-dashed bg-transparent text-muted line-through hover:border-line',
                    showError && !size && !out && 'border-sale/60',
                  )}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </fieldset>
      )}
    </div>
  )
}
