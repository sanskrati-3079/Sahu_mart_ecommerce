import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { resizeImage } from '@/data/images'
import { formatINR } from '@/lib/format'
import type { CartLine } from '@/hooks/useCartSummary'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import { QuantityStepper } from './QuantityStepper'

export function CartLineItem({ line, compact, onNavigate }: { line: CartLine; compact?: boolean; onNavigate?: () => void }) {
  const { item, product, stock } = line
  const setQuantity = useCart((s) => s.setQuantity)
  const remove = useCart((s) => s.remove)
  const add = useCart((s) => s.add)
  const toggleWish = useWishlist((s) => s.toggle)
  const inWishlist = useWishlist((s) => s.ids.includes(product.id))
  const variantText = [item.color, item.size].filter(Boolean).join(' · ')
  const unit = product.priceUnit === 'per metre' ? ' m' : ''

  const onRemove = () => {
    remove(item.key)
    toast('Removed from bag', {
      description: product.name,
      action: {
        label: 'Undo',
        onClick: () => add({ productId: item.productId, sku: item.sku, color: item.color, size: item.size, quantity: item.quantity }),
      },
    })
  }

  return (
    <li className="flex gap-4 py-5">
      <Link to={`/product/${product.slug}`} onClick={onNavigate} className="shrink-0 self-start overflow-hidden rounded-md bg-sage">
        <img
          src={resizeImage(product.images[0], 240)}
          alt={product.name}
          className={compact ? 'h-28 w-[88px] object-cover' : 'h-36 w-28 object-cover sm:h-40 sm:w-32'}
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] tracking-[0.08em] text-muted uppercase">{product.brand}</p>
            <Link
              to={`/product/${product.slug}`}
              onClick={onNavigate}
              className="mt-0.5 line-clamp-2 text-[14px] leading-snug hover:text-forest"
            >
              {product.name}
            </Link>
            {variantText && <p className="mt-1 text-[13px] text-muted">{variantText}</p>}
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[14px] font-semibold">{formatINR(product.price * item.quantity)}</p>
            {product.mrp > product.price && <p className="text-[12px] text-muted line-through">{formatINR(product.mrp * item.quantity)}</p>}
          </div>
        </div>
        <p className="mt-1 text-[12px] text-muted">
          {formatINR(product.price)} {product.priceUnit}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-3">
          <QuantityStepper
            value={item.quantity}
            max={stock}
            onChange={(q) => setQuantity(item.key, q)}
            label={`Quantity for ${product.name}`}
          />
          {unit && <span className="text-[12px] text-muted">metres</span>}
          {item.quantity >= stock && <span className="text-[12px] text-sale">Max available</span>}
          <div className="ml-auto flex items-center gap-1">
            {!compact && !inWishlist && (
              <button
                type="button"
                onClick={() => {
                  toggleWish(product.id)
                  remove(item.key)
                  toast.success('Moved to wishlist', { description: product.name })
                }}
                className="rounded-md px-2 py-1.5 text-[13px] text-forest underline-offset-2 hover:underline"
              >
                Move to wishlist
              </button>
            )}
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted hover:bg-sage hover:text-charcoal"
              aria-label={`Remove ${product.name} from bag`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}
