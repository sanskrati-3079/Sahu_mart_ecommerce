import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { resizeImage } from '@/data/images'
import { useAddToCart } from '@/hooks/useAddToCart'
import { isInStock } from '@/lib/catalog'
import { discountPercent } from '@/lib/format'
import { cn } from '@/lib/utils'
import { defaultSelection, findVariant, needsColor, needsSize } from '@/lib/variants'
import type { Product } from '@/types'
import { Price } from './Price'
import { QuickAddDialog } from './QuickAddDialog'
import { Rating } from './Rating'
import { WishlistButton } from './WishlistButton'

interface ProductCardProps {
  product: Product
  className?: string
  /** Load the image eagerly (above the fold). */
  priority?: boolean
  hideQuickAdd?: boolean
}

export function ProductCard({ product, className, priority, hideQuickAdd }: ProductCardProps) {
  const [quickOpen, setQuickOpen] = useState(false)
  const addToCart = useAddToCart()
  const inStock = isInStock(product)
  const off = discountPercent(product.price, product.mrp)
  const second = product.images[1]

  const quickAdd = () => {
    if (needsColor(product) || needsSize(product)) return setQuickOpen(true)
    const sel = defaultSelection(product)
    const variant = findVariant(product, sel.color, sel.size)
    if (variant) addToCart(product, variant, 1)
  }

  return (
    <article className={cn('group relative flex flex-col', className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-sage">
        <Link to={`/product/${product.slug}`} className="absolute inset-0" tabIndex={-1} aria-hidden>
          <img
            src={resizeImage(product.images[0], 600)}
            srcSet={`${resizeImage(product.images[0], 400)} 400w, ${resizeImage(product.images[0], 700)} 700w`}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            alt=""
            loading={priority ? 'eager' : 'lazy'}
            className={cn(
              'h-full w-full object-cover transition-[transform,opacity] duration-500 ease-out group-hover:scale-[1.04]',
              !inStock && 'opacity-70 grayscale-[30%]',
            )}
          />
          {second && (
            <img
              src={resizeImage(second, 600)}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
        </Link>

        <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {!inStock && (
            <span className="rounded-sm bg-charcoal px-2 py-1 text-[10px] font-semibold tracking-wider text-white uppercase">
              Out of stock
            </span>
          )}
          {product.isNew && inStock && (
            <span className="rounded-sm bg-forest px-2 py-1 text-[10px] font-semibold tracking-wider text-ivory uppercase">New</span>
          )}
          {product.isBestseller && inStock && (
            <span className="rounded-sm bg-ivory px-2 py-1 text-[10px] font-semibold tracking-wider text-forest uppercase">Bestseller</span>
          )}
          {off > 0 && inStock && (
            <span className="rounded-sm bg-sale px-2 py-1 text-[10px] font-semibold tracking-wider text-white">{off}% OFF</span>
          )}
        </div>

        <WishlistButton product={product} className="absolute top-3 right-3 z-10" />

        {!hideQuickAdd && inStock && (
          <button
            type="button"
            onClick={quickAdd}
            aria-label={`Quick add ${product.name} to bag`}
            className="absolute right-2.5 bottom-2.5 z-10 inline-flex h-9 w-9 items-center justify-center gap-1.5 rounded-full bg-ivory/95 text-[13px] font-medium text-forest shadow-soft transition-all duration-200 hover:bg-forest hover:text-ivory focus-visible:translate-y-0 focus-visible:opacity-100 lg:right-3 lg:bottom-3 lg:left-3 lg:h-10 lg:w-auto lg:translate-y-2 lg:rounded-md lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
          >
            <Plus className="h-4 w-4" aria-hidden /> <span className="hidden lg:inline">Quick add</span>
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <p className="text-[11px] tracking-[0.08em] text-muted uppercase">{product.brand}</p>
        <h3 className="mt-1 line-clamp-2 text-[14px] leading-snug text-charcoal">
          <Link
            to={`/product/${product.slug}`}
            className="after:absolute after:inset-0 after:content-[''] hover:text-forest focus-visible:outline-none [&:focus-visible]:after:rounded-lg [&:focus-visible]:after:outline-2 [&:focus-visible]:after:outline-forest"
          >
            {product.name}
          </Link>
        </h3>
        <Price product={product} className="mt-1.5" />
        <Rating value={product.rating} count={product.reviewCount} className="mt-1.5" />
      </div>

      {quickOpen && <QuickAddDialog product={product} open={quickOpen} onOpenChange={setQuickOpen} />}
    </article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div aria-hidden>
      <Skeleton className="aspect-[4/5] w-full rounded-lg" />
      <Skeleton className="mt-3 h-3 w-1/3" />
      <Skeleton className="mt-2 h-4 w-5/6" />
      <Skeleton className="mt-2 h-4 w-1/2" />
    </div>
  )
}
