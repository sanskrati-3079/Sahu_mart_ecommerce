import { Link, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { OrderFacts, OrderLines, OrderTotals } from '@/components/account/OrderDetails'
import { usePageTitle } from '@/components/PageMeta'
import { Button } from '@/components/ui/button'
import { DemoNote } from '@/components/ui/demo-note'
import { useOrders } from '@/store/orders'
import NotFound from './NotFound'

function SuccessMark() {
  return (
    <motion.svg viewBox="0 0 64 64" className="h-20 w-20" initial="hidden" animate="show" aria-hidden>
      <motion.circle
        cx="32"
        cy="32"
        r="29"
        fill="none"
        stroke="#173F35"
        strokeWidth="2.5"
        variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 0.6, ease: 'easeOut' } } }}
      />
      <motion.path
        d="M20 33.5 28.5 42 45 24"
        fill="none"
        stroke="#C5A46D"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { delay: 0.45, duration: 0.4, ease: 'easeOut' } } }}
      />
    </motion.svg>
  )
}

export default function OrderConfirmation() {
  const { id = '' } = useParams()
  const order = useOrders((s) => s.orders.find((o) => o.id === id))
  usePageTitle(order ? `Order ${order.id} confirmed` : 'Order not found')

  if (!order)
    return (
      <NotFound
        title="We couldn’t find that order"
        message="Orders are stored in the browser they were placed in. Check the order number, or track it from the order tracking page."
      />
    )

  return (
    <div className="container-page max-w-4xl pt-10">
      <div className="flex flex-col items-center text-center">
        <SuccessMark />
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }}>
          <p className="eyebrow mt-6">Thank you</p>
          <h1 className="display mt-3 text-[36px] leading-tight sm:text-[44px]">Your order is placed</h1>
          <p className="mt-3 text-[15px] text-muted">
            Order number <strong className="font-semibold tracking-wide text-charcoal">{order.id}</strong>
          </p>
          <p className="mt-1 text-[14px] text-muted">A confirmation would be sent to {order.email} (demo — no email is sent).</p>
        </motion.div>
      </div>

      <DemoNote className="mx-auto mt-8 max-w-2xl justify-center">
        This is a demonstration order. No payment has been taken and nothing will be shipped.
      </DemoNote>

      <div className="mt-10 grid gap-6 lg:grid-cols-5">
        <section aria-labelledby="conf-items" className="rounded-lg border border-line bg-white p-6 lg:col-span-3">
          <h2 id="conf-items" className="font-display text-2xl">
            Items
          </h2>
          <OrderLines order={order} />
          <div className="border-t border-line pt-4">
            <OrderTotals order={order} />
          </div>
        </section>
        <section aria-labelledby="conf-details" className="rounded-lg border border-line bg-white p-6 lg:col-span-2">
          <h2 id="conf-details" className="font-display text-2xl">
            Details
          </h2>
          <div className="mt-4 [&_dl]:grid-cols-1">
            <OrderFacts order={order} />
          </div>
        </section>
      </div>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link to={`/track-order?id=${order.id}`}>Track order</Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link to="/shop">Continue shopping</Link>
        </Button>
      </div>
    </div>
  )
}
