import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, X } from 'lucide-react'
import { toast } from 'sonner'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { StaggerGrid, StaggerItem } from '@/components/motion'
import { usePageTitle } from '@/components/PageMeta'
import { Price } from '@/components/product/Price'
import { QuickAddDialog } from '@/components/product/QuickAddDialog'
import { Button } from '@/components/ui/button'
import { resizeImage } from '@/data/images'
import { useAddToCart } from '@/hooks/useAddToCart'
import { getProductsByIds, isInStock } from '@/lib/catalog'
import { pluralize } from '@/lib/format'
import { defaultSelection, findVariant, needsSize } from '@/lib/variants'
import { useWishlist } from '@/store/wishlist'
import type { Product } from '@/types'

function WishlistItem({ product }: { product: Product }) {
  const remove = useWishlist((s) => s.remove)
  const addToCart = useAddToCart()
  const [picking, setPicking] = useState(false)
  const inStock = isInStock(product)

  const moveToBag = () => {
    const sel = defaultSelection(product)
    const variant = findVariant(product, sel.color, sel.size)
    if (needsSize(product) || !variant || variant.stock === 0) return setPicking(true)
    if (addToCart(product, variant, 1)) remove(product.id)
  }

  return (
    <article className="group flex h-full flex-col">
      <div className="relative overflow-hidden rounded-lg bg-sage">
        <Link to={`/product/${product.slug}`}>
          <img
            src={resizeImage(product.images[0], 600)}
            alt={product.name}
            className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>
        <button
          type="button"
          onClick={() => {
            remove(product.id)
            toast('Removed from wishlist', { description: product.name })
          }}
          className="absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-soft hover:bg-white"
          aria-label={`Remove ${product.name} from wishlist`}
        >
          <X className="h-4 w-4" />
        </button>
        {!inStock && (
          <span className="absolute top-3 left-3 rounded-sm bg-charcoal px-2 py-1 text-[10px] font-semibold tracking-wider text-white uppercase">
            Out of stock
          </span>
        )}
      </div>
      <p className="mt-3 text-[11px] tracking-[0.08em] text-muted uppercase">{product.brand}</p>
      <Link to={`/product/${product.slug}`} className="mt-1 line-clamp-2 text-[14px] leading-snug hover:text-forest">
        {product.name}
      </Link>
      <Price product={product} className="mt-1.5" />
      <div className="mt-auto pt-4">
        <Button variant={inStock ? 'secondary' : 'outline'} size="sm" className="w-full" onClick={moveToBag} disabled={!inStock}>
          <ShoppingBag aria-hidden /> {inStock ? 'Move to bag' : 'Out of stock'}
        </Button>
      </div>
      {picking && <QuickAddDialog product={product} open={picking} onOpenChange={setPicking} onAdded={() => remove(product.id)} />}
    </article>
  )
}

export default function Wishlist() {
  usePageTitle('Wishlist')
  const ids = useWishlist((s) => s.ids)
  const items = getProductsByIds(ids)

  return (
    <div className="container-page pt-6">
      <Breadcrumbs items={[{ label: 'Wishlist' }]} />
      <h1 className="display mt-6 text-[40px]">
        Wishlist {items.length > 0 && <span className="font-sans text-base text-muted">({pluralize(items.length, 'item')})</span>}
      </h1>
      {items.length === 0 ? (
        <div className="mx-auto max-w-lg py-20 text-center">
          <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-sage">
            <Heart className="h-8 w-8 text-forest" aria-hidden />
          </span>
          <p className="display mt-6 text-3xl">Nothing saved yet</p>
          <p className="mt-3 text-muted">Tap the heart on any product to save it here for later. Your wishlist is kept in this browser.</p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/shop">Discover products</Link>
          </Button>
        </div>
      ) : (
        <>
          <p className="mt-2 text-sm text-muted">Saved in this browser. Move pieces to your bag when you’re ready.</p>
          <StaggerGrid className="mt-8 grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
            {items.map((p) => (
              <StaggerItem key={p.id}>
                <WishlistItem product={p} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </>
      )}
    </div>
  )
}
