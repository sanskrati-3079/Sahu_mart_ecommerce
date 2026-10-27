import { toast } from 'sonner'
import { useCart } from '@/store/cart'
import type { Product, Variant } from '@/types'

/** Adds a variant to the bag, opens the drawer and shows a toast. */
export function useAddToCart() {
  const add = useCart((s) => s.add)
  const setDrawerOpen = useCart((s) => s.setDrawerOpen)

  return (product: Product, variant: Variant, quantity = 1, { openDrawer = true } = {}) => {
    const { added, capped } = add({ productId: product.id, sku: variant.sku, color: variant.color, size: variant.size, quantity })
    if (added === 0) {
      toast.error('No more stock available', { description: `You already have all available ${product.name} in your bag.` })
      return false
    }
    toast.success('Added to bag', {
      description: capped ? `${product.name} — only ${added} more could be added (stock limit).` : product.name,
      action: { label: 'View bag', onClick: () => setDrawerOpen(true) },
    })
    if (openDrawer) setDrawerOpen(true)
    return true
  }
}
