import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { cn } from '@/lib/utils'
import { useScrolled } from '@/hooks/useScrolled'
import { selectCartCount, useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import { AccountMenu } from './AccountMenu'
import { MegaMenu } from './MegaMenu'
import { MobileMenu } from './MobileMenu'
import { PincodeDialog } from './PincodeDialog'
import { SearchBox } from './SearchBox'

function CountBadge({ count }: { count: number }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute -top-0.5 -right-0.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-forest px-1 text-[10px] font-semibold text-ivory"
          aria-hidden
        >
          {count > 99 ? '99+' : count}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

export function Header() {
  const scrolled = useScrolled()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const cartCount = useCart(selectCartCount)
  const openCart = useCart((s) => s.setDrawerOpen)
  const wishCount = useWishlist((s) => s.ids.length)
  const location = useLocation()

  useEffect(() => setSearchOpen(false), [location.pathname, location.search])

  const iconBtn = 'relative inline-flex h-10 w-10 items-center justify-center rounded-md text-charcoal transition-colors hover:bg-sage'

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b bg-ivory/95 backdrop-blur-[2px] transition-[border-color,box-shadow] duration-200',
        scrolled ? 'border-line shadow-[0_1px_0_rgba(36,36,36,0.02)]' : 'border-transparent',
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-forest focus:px-4 focus:py-2 focus:text-ivory"
      >
        Skip to content
      </a>
      <div className="container-page flex h-16 items-center gap-2 lg:h-20 lg:gap-6">
        <button type="button" className={cn(iconBtn, '-ml-2 lg:hidden')} aria-label="Open menu" onClick={() => setMenuOpen(true)}>
          <Menu className="h-5 w-5" />
        </button>
        <Link to="/" aria-label="Sahu Marts home" className="shrink-0">
          <Logo size="sm" className="lg:hidden" />
          <Logo size="md" className="hidden lg:inline-flex" />
        </Link>

        <SearchBox className="mx-auto hidden w-full max-w-xl lg:block" />

        <div className="ml-auto flex items-center gap-0.5 lg:ml-0 lg:gap-2">
          <PincodeDialog className="hidden lg:flex" />
          <div className="hidden lg:block">
            <AccountMenu />
          </div>
          <button
            type="button"
            className={cn(iconBtn, 'lg:hidden')}
            aria-label={searchOpen ? 'Close search' : 'Open search'}
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((o) => !o)}
          >
            {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>
          <Link to="/wishlist" className={iconBtn} aria-label={`Wishlist, ${wishCount} ${wishCount === 1 ? 'item' : 'items'}`}>
            <Heart className="h-5 w-5" />
            <CountBadge count={wishCount} />
          </Link>
          <button
            type="button"
            className={iconBtn}
            aria-label={`Shopping bag, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
            data-cart-trigger
            onClick={() => openCart(true)}
          >
            <ShoppingBag className="h-5 w-5" />
            <CountBadge count={cartCount} />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-line lg:hidden"
          >
            <div className="container-page py-3">
              <SearchBox autoFocus onNavigate={() => setSearchOpen(false)} />
              <div className="mt-2 flex justify-start">
                <PincodeDialog className="-ml-2" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MegaMenu />
      <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
    </header>
  )
}
