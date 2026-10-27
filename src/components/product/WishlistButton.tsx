import { motion } from 'motion/react'
import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useWishlist } from '@/store/wishlist'
import type { Product } from '@/types'

interface WishlistButtonProps {
  product: Pick<Product, 'id' | 'name'>
  className?: string
  variant?: 'icon' | 'full'
}

export function WishlistButton({ product, className, variant = 'icon' }: WishlistButtonProps) {
  const saved = useWishlist((s) => s.ids.includes(product.id))
  const toggle = useWishlist((s) => s.toggle)
  const navigate = useNavigate()

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const added = toggle(product.id)
    if (added)
      toast.success('Saved to wishlist', {
        description: product.name,
        action: { label: 'View wishlist', onClick: () => navigate('/wishlist') },
      })
    else toast('Removed from wishlist', { description: product.name })
  }

  const heart = (
    <motion.span
      key={String(saved)}
      initial={{ scale: saved ? 0.6 : 1 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      className="inline-flex"
    >
      <Heart className={cn('h-[18px] w-[18px] transition-colors', saved ? 'fill-sale text-sale' : 'text-charcoal')} aria-hidden />
    </motion.span>
  )

  if (variant === 'full') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={saved}
        className={cn(
          'inline-flex h-12 items-center justify-center gap-2 rounded-md border border-line bg-white px-5 text-sm font-medium transition-colors hover:border-charcoal',
          className,
        )}
      >
        {heart}
        {saved ? 'Saved to wishlist' : 'Add to wishlist'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-soft transition-transform hover:scale-105',
        className,
      )}
    >
      {heart}
    </button>
  )
}
