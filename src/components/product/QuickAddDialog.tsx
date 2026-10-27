import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { resizeImage } from '@/data/images'
import { useAddToCart } from '@/hooks/useAddToCart'
import { defaultSelection, findVariant, selectionHint, sizeStock } from '@/lib/variants'
import type { Product } from '@/types'
import { Price } from './Price'
import { VariantSelector } from './VariantSelector'

interface QuickAddDialogProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdded?: () => void
}

export function QuickAddDialog({ product, open, onOpenChange, onAdded }: QuickAddDialogProps) {
  const initial = defaultSelection(product)
  const [color, setColor] = useState(initial.color)
  const [size, setSize] = useState(initial.size)
  const [tried, setTried] = useState(false)
  const addToCart = useAddToCart()
  const variant = findVariant(product, color, size)
  const hint = selectionHint(product, color, size)

  const submit = () => {
    setTried(true)
    if (hint || !variant || variant.stock === 0) return
    if (addToCart(product, variant, 1)) {
      onOpenChange(false)
      onAdded?.()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0">
        <div className="grid sm:grid-cols-[220px_1fr]">
          <img
            src={resizeImage(product.images[0], 500)}
            alt={product.name}
            className="hidden h-full max-h-[420px] w-full rounded-l-lg object-cover sm:block"
          />
          <div className="p-6">
            <p className="text-[12px] tracking-wide text-muted uppercase">{product.brand}</p>
            <DialogTitle className="display mt-1 pr-8 text-xl leading-snug">{product.name}</DialogTitle>
            <DialogDescription className="sr-only">Choose options and add to bag</DialogDescription>
            <Price product={product} size="md" className="mt-2" />
            <div className="mt-6">
              <VariantSelector
                product={product}
                color={color}
                size={size}
                idPrefix={`qa-${product.id}`}
                showError={tried}
                onColor={(c) => {
                  setColor(c)
                  if (size && sizeStock(product, size, c) === 0) setSize(undefined)
                }}
                onSize={setSize}
              />
            </div>
            <p className="mt-4 min-h-5 text-[13px] text-sale" role="alert">
              {tried && hint}
            </p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <Button size="lg" className="flex-1" onClick={submit} aria-disabled={Boolean(hint)}>
                Add to bag
              </Button>
              <Button asChild size="lg" variant="outline" className="flex-1">
                <Link to={`/product/${product.slug}`} onClick={() => onOpenChange(false)}>
                  View details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
