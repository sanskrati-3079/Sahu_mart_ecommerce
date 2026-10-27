import { useState } from 'react'
import { Tag, X } from 'lucide-react'
import { toast } from 'sonner'
import { coupons } from '@/data/coupons'
import { validateCoupon } from '@/lib/pricing'
import { useCart } from '@/store/cart'

export function CouponBox({ subtotal }: { subtotal: number }) {
  const couponCode = useCart((s) => s.couponCode)
  const applyCoupon = useCart((s) => s.applyCoupon)
  const removeCoupon = useCart((s) => s.removeCoupon)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const apply = (value: string) => {
    const result = validateCoupon(value, subtotal)
    if (!result.ok) {
      setError(result.error)
      return
    }
    applyCoupon(result.coupon.code)
    setError('')
    setCode('')
    toast.success(`Coupon ${result.coupon.code} applied`, { description: result.coupon.description })
  }

  return (
    <div className="rounded-lg border border-line bg-white p-6">
      <h2 className="flex items-center gap-2 text-[15px] font-semibold">
        <Tag className="h-4 w-4 text-forest" aria-hidden /> Coupons
      </h2>
      {couponCode ? (
        <div className="mt-4 flex items-center justify-between rounded-md border border-dashed border-forest bg-sage px-4 py-3">
          <div>
            <p className="text-[14px] font-semibold text-forest">{couponCode} applied</p>
            <p className="text-[12px] text-muted">{coupons.find((c) => c.code === couponCode)?.description}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              removeCoupon()
              toast('Coupon removed')
            }}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[13px] text-charcoal hover:bg-white"
            aria-label={`Remove coupon ${couponCode}`}
          >
            <X className="h-4 w-4" aria-hidden /> Remove
          </button>
        </div>
      ) : (
        <>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              apply(code)
            }}
            noValidate
          >
            <label htmlFor="coupon" className="sr-only">
              Coupon code
            </label>
            <input
              id="coupon"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase())
                setError('')
              }}
              placeholder="Enter coupon code"
              autoComplete="off"
              aria-invalid={Boolean(error)}
              aria-describedby="coupon-msg"
              className="h-11 min-w-0 flex-1 rounded-md border border-line px-3.5 text-[14px] tracking-wide uppercase placeholder:normal-case placeholder:tracking-normal focus:border-forest focus:outline-none aria-[invalid=true]:border-sale"
            />
            <button type="submit" className="h-11 rounded-md bg-forest px-5 text-sm font-medium text-ivory hover:bg-forest-dark">
              Apply
            </button>
          </form>
          <p id="coupon-msg" role={error ? 'alert' : undefined} className="mt-2 min-h-5 text-[13px] text-sale">
            {error}
          </p>
          <p className="mt-2 text-[12px] font-semibold tracking-[0.12em] text-muted uppercase">Available for you (demo)</p>
          <ul className="mt-2 space-y-2">
            {coupons.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => apply(c.code)}
                  className="flex w-full items-center justify-between gap-3 rounded-md border border-line px-3 py-2.5 text-left transition-colors hover:border-forest"
                >
                  <span>
                    <span className="block text-[13px] font-semibold tracking-wide">{c.code}</span>
                    <span className="block text-[12px] text-muted">{c.description}</span>
                  </span>
                  <span className="text-[13px] font-medium text-forest">Apply</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
