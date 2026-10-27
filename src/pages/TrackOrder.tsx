import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PackageSearch } from 'lucide-react'
import { toast } from 'sonner'
import { OrderTimeline, StatusBadge } from '@/components/account/OrderTimeline'
import { OrderFacts, OrderLines, OrderTotals } from '@/components/account/OrderDetails'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { usePageTitle } from '@/components/PageMeta'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { DemoBadge } from '@/components/ui/demo-note'
import { FieldError, Input, Label } from '@/components/ui/input'
import { canCancel } from '@/lib/tracking'
import { useOrders } from '@/store/orders'

export default function TrackOrder() {
  usePageTitle('Track your order')
  const [sp, setSp] = useSearchParams()
  const queryId = (sp.get('id') ?? '').toUpperCase()
  const [value, setValue] = useState(queryId)
  const [error, setError] = useState('')
  const [confirmCancel, setConfirmCancel] = useState(false)
  const order = useOrders((s) => (queryId ? s.orders.find((o) => o.id === queryId) : undefined))
  const allOrders = useOrders((s) => s.orders)
  const recent = allOrders.slice(0, 3)
  const cancel = useOrders((s) => s.cancel)
  const [, setTick] = useState(0)

  // Re-render every 30 seconds so the simulated timeline moves on its own.
  useEffect(() => {
    const t = window.setInterval(() => setTick((n) => n + 1), 30_000)
    return () => window.clearInterval(t)
  }, [])

  useEffect(() => {
    setValue(queryId)
    setError(queryId && !order ? `We couldn’t find order ${queryId} in this browser. Check the number and try again.` : '')
  }, [queryId, order])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const id = value.trim().toUpperCase()
    if (!/^SM-DEMO-\d{5}$/.test(id)) {
      setError('Order numbers look like SM-DEMO-48213.')
      return
    }
    setSp({ id })
  }

  return (
    <div className="container-page max-w-4xl pt-6">
      <Breadcrumbs items={[{ label: 'Track order' }]} />
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <h1 className="display text-[36px] sm:text-[44px]">Track your order</h1>
        <DemoBadge />
      </div>
      <p className="mt-2 text-[15px] text-muted">
        Enter the order number from your confirmation page. Tracking is simulated for this demo.
      </p>

      <form onSubmit={submit} noValidate className="mt-8 rounded-lg border border-line bg-white p-5 sm:p-6">
        <Label htmlFor="track-id">Order number</Label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id="track-id"
            value={value}
            onChange={(e) => {
              setValue(e.target.value.toUpperCase())
              setError('')
            }}
            placeholder="e.g. SM-DEMO-48213"
            autoComplete="off"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'track-error' : undefined}
            className="uppercase placeholder:normal-case"
          />
          <Button type="submit" size="lg" className="shrink-0">
            Track order
          </Button>
        </div>
        <FieldError id="track-error" message={error} />
        {!order && recent.length > 0 && (
          <p className="mt-4 text-[13px] text-muted">
            Recent orders in this browser:{' '}
            {recent.map((o, i) => (
              <span key={o.id}>
                {i > 0 && ', '}
                <Link to={`/track-order?id=${o.id}`} className="font-medium text-forest underline">
                  {o.id}
                </Link>
              </span>
            ))}
          </p>
        )}
      </form>

      {order ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          <section aria-labelledby="track-status" className="rounded-lg border border-line bg-white p-6 lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <h2 id="track-status" className="font-display text-2xl">
                {order.id}
              </h2>
              <StatusBadge order={order} />
            </div>
            <p className="mt-1 text-[12px] text-muted">Simulated tracking — updates automatically over time.</p>
            <div className="mt-6">
              <OrderTimeline order={order} />
            </div>
            {canCancel(order) && (
              <div className="mt-6 border-t border-line pt-5">
                <p className="text-[13px] text-muted">You can cancel while the order is Placed or Confirmed.</p>
                <Button variant="outline" className="mt-3" onClick={() => setConfirmCancel(true)}>
                  Cancel order
                </Button>
              </div>
            )}
          </section>
          <section aria-label="Order details" className="space-y-6 rounded-lg border border-line bg-white p-6 lg:col-span-3">
            <OrderFacts order={order} />
            <div>
              <h3 className="text-[15px] font-semibold">Items</h3>
              <OrderLines order={order} />
              <div className="border-t border-line pt-4">
                <OrderTotals order={order} />
              </div>
            </div>
          </section>
        </div>
      ) : (
        !queryId && (
          <div className="mt-10 flex flex-col items-center text-center text-muted">
            <PackageSearch className="h-10 w-10 text-forest" aria-hidden />
            <p className="mt-3 max-w-sm text-[14px]">
              Don’t have an order yet?{' '}
              <Link to="/shop" className="text-forest underline">
                Start shopping
              </Link>{' '}
              and place a demo order to see tracking in action.
            </p>
          </div>
        )
      )}

      <Dialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <DialogContent className="max-w-md">
          <DialogTitle className="display text-2xl">Cancel this order?</DialogTitle>
          <DialogDescription className="mt-2 text-sm text-muted">
            Order {order?.id} will be cancelled. This is a demo, so no refund is needed.
          </DialogDescription>
          <div className="mt-6 flex gap-3">
            <Button
              onClick={() => {
                if (order) cancel(order.id)
                setConfirmCancel(false)
                toast('Order cancelled', { description: order?.id })
              }}
            >
              Yes, cancel order
            </Button>
            <DialogClose asChild>
              <Button variant="ghost">Keep order</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
