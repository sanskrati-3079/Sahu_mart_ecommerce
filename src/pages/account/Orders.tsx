import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import { AccountShell } from '@/components/account/AccountShell'
import { OrderFacts, OrderLines, OrderTotals } from '@/components/account/OrderDetails'
import { OrderTimeline, StatusBadge } from '@/components/account/OrderTimeline'
import { usePageTitle } from '@/components/PageMeta'
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { resizeImage } from '@/data/images'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { formatDate, formatINR, pluralize } from '@/lib/format'
import { useAuth } from '@/store/auth'
import { useOrders } from '@/store/orders'

export default function Orders() {
  usePageTitle('My orders')
  const email = useAuth((s) => s.user?.email ?? '')
  const all = useOrders((s) => s.orders)
  const orders = all.filter((o) => o.email === email)

  return (
    <AccountShell title="Orders" crumb="Orders">
      {orders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line bg-white px-6 py-14 text-center">
          <Package className="mx-auto h-8 w-8 text-forest" aria-hidden />
          <p className="mt-4 font-medium">No orders yet</p>
          <p className="mt-1 text-sm text-muted">Orders you place while signed in with {email} will appear here.</p>
          <Button asChild className="mt-6">
            <Link to="/shop">Start shopping</Link>
          </Button>
        </div>
      ) : (
        <Accordion type="single" collapsible className="space-y-4">
          {orders.map((o) => (
            <AccordionItem key={o.id} value={o.id} className="overflow-hidden rounded-lg border border-line bg-white">
              <AccordionPrimitive.Header>
                <AccordionPrimitive.Trigger className="group flex w-full flex-wrap items-center gap-4 p-5 text-left hover:bg-sage/40">
                  <div className="flex -space-x-3">
                    {o.lines.slice(0, 3).map((l) => (
                      <img
                        key={l.productId + l.size + l.color}
                        src={resizeImage(l.image, 100)}
                        alt=""
                        className="h-14 w-11 rounded-md border-2 border-white object-cover"
                      />
                    ))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold tracking-wide">{o.id}</p>
                    <p className="text-[13px] text-muted">
                      {formatDate(o.createdAt)} · {pluralize(o.summary.itemCount, 'item')} · {formatINR(o.summary.total)}
                    </p>
                  </div>
                  <StatusBadge order={o} />
                  <span className="text-[13px] font-medium text-forest">
                    <span className="group-data-[state=open]:hidden">View details</span>
                    <span className="hidden group-data-[state=open]:inline">Hide details</span>
                  </span>
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionContent className="border-t border-line px-5 pt-5">
                <div className="grid gap-8 lg:grid-cols-5">
                  <div className="lg:col-span-2">
                    <OrderTimeline order={o} />
                    <Button asChild variant="secondary" size="sm" className="mt-6">
                      <Link to={`/track-order?id=${o.id}`}>Open tracking page</Link>
                    </Button>
                  </div>
                  <div className="space-y-6 lg:col-span-3">
                    <OrderFacts order={o} />
                    <OrderLines order={o} />
                    <OrderTotals order={o} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </AccountShell>
  )
}
