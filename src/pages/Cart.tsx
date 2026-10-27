import { Link } from 'react-router-dom'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { usePageTitle } from '@/components/PageMeta'
import { CartLineItem } from '@/components/cart/CartLineItem'
import { CouponBox } from '@/components/cart/CouponBox'
import { FreeShippingBar } from '@/components/cart/FreeShippingBar'
import { OrderSummary } from '@/components/cart/OrderSummary'
import { ProductRow } from '@/components/product/ProductRow'
import { Button } from '@/components/ui/button'
import { useCartSummary } from '@/hooks/useCartSummary'
import { getBestsellers } from '@/lib/catalog'
import { pluralize } from '@/lib/format'

export default function Cart() {
  usePageTitle('Your bag')
  const { lines, summary, couponCode, toFreeShipping } = useCartSummary()

  if (!lines.length) {
    return (
      <div className="container-page pt-6">
        <Breadcrumbs items={[{ label: 'Bag' }]} />
        <div className="mx-auto max-w-lg py-20 text-center">
          <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-sage">
            <ShoppingBag className="h-8 w-8 text-forest" aria-hidden />
          </span>
          <h1 className="display mt-6 text-4xl">Your bag is empty</h1>
          <p className="mt-3 text-muted">Looks like you haven’t added anything yet. Start with our bestsellers, or browse by budget.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/shop">Start shopping</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/wishlist">View wishlist</Link>
            </Button>
          </div>
        </div>
        <section aria-labelledby="cart-trending" className="mt-6">
          <h2 id="cart-trending" className="display -mb-10 text-[32px]">
            Trending now
          </h2>
          <ProductRow products={getBestsellers(10)} label="Trending products" />
        </section>
      </div>
    )
  }

  return (
    <div className="container-page pt-6">
      <Breadcrumbs items={[{ label: 'Bag' }]} />
      <h1 className="display mt-6 text-[40px]">
        Your bag <span className="font-sans text-base text-muted">({pluralize(summary.itemCount, 'item')})</span>
      </h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="rounded-lg bg-sage px-5 py-4">
            <FreeShippingBar subtotal={summary.subtotal} remaining={toFreeShipping} />
          </div>
          <ul className="mt-2 divide-y divide-line border-b border-line">
            {lines.map((l) => (
              <CartLineItem key={l.item.key} line={l} />
            ))}
          </ul>
          <Link to="/shop" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-forest hover:underline">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Continue shopping
          </Link>
        </div>

        <div className="space-y-5 lg:col-span-5 xl:col-span-4">
          <div className="space-y-5 lg:sticky lg:top-36">
            <CouponBox subtotal={summary.subtotal} />
            <OrderSummary summary={summary} couponCode={couponCode}>
              <Button asChild size="lg" className="w-full">
                <Link to="/checkout">Proceed to checkout</Link>
              </Button>
              <Button asChild variant="ghost" className="mt-2 w-full">
                <Link to="/shop">Continue shopping</Link>
              </Button>
              <p className="mt-3 text-center text-[12px] text-muted">Demo store — no real payment is processed.</p>
            </OrderSummary>
          </div>
        </div>
      </div>
    </div>
  )
}
