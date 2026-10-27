import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { useCartSummary } from '@/hooks/useCartSummary'
import { formatINR, pluralize } from '@/lib/format'
import { useCart } from '@/store/cart'
import { CartLineItem } from './CartLineItem'
import { FreeShippingBar } from './FreeShippingBar'

export function CartDrawer() {
  const open = useCart((s) => s.drawerOpen)
  const setOpen = useCart((s) => s.setDrawerOpen)
  const { lines, summary, toFreeShipping } = useCartSummary()
  const navigate = useNavigate()
  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        onCloseAutoFocus={(e) => {
          const trigger = document.querySelector<HTMLElement>('[data-cart-trigger]')
          if (trigger) {
            e.preventDefault()
            trigger.focus()
          }
        }}
      >
        <div className="flex h-16 shrink-0 items-center border-b border-line px-6">
          <SheetTitle className="font-display text-xl">
            Your bag{' '}
            {summary.itemCount > 0 && <span className="font-sans text-sm text-muted">({pluralize(summary.itemCount, 'item')})</span>}
          </SheetTitle>
          <SheetDescription className="sr-only">Items in your shopping bag</SheetDescription>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-sage">
              <ShoppingBag className="h-7 w-7 text-forest" aria-hidden />
            </span>
            <p className="display mt-5 text-2xl">Your bag is empty</p>
            <p className="mt-2 text-sm text-muted">Discover something you’ll love — from silk sarees to cabin trolleys.</p>
            <Button
              className="mt-6"
              onClick={() => {
                close()
                navigate('/shop')
              }}
            >
              Start shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="border-b border-line px-6 py-4">
              <FreeShippingBar subtotal={summary.subtotal} remaining={toFreeShipping} />
            </div>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {lines.map((l) => (
                <CartLineItem key={l.item.key} line={l} compact onNavigate={close} />
              ))}
            </ul>
            <div className="border-t border-line bg-white px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm">Subtotal</span>
                <span className="text-lg font-semibold">{formatINR(summary.subtotal)}</span>
              </div>
              {summary.savings > 0 && (
                <p className="mt-1 text-right text-[13px] text-success">You save {formatINR(summary.savings)} on MRP</p>
              )}
              <p className="mt-1 text-[12px] text-muted">Shipping and coupons are calculated at checkout.</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button asChild variant="secondary">
                  <Link to="/cart" onClick={close}>
                    View bag
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/checkout" onClick={close}>
                    Checkout
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
