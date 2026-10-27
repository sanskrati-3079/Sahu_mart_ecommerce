import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Banknote, Check, ChevronDown, CreditCard, Lock, Pencil, Plus, ShoppingBag, Smartphone, Truck, Zap } from 'lucide-react'
import { z } from 'zod'
import { AddressForm } from '@/components/account/AddressForm'
import { toAddressData, type AddressData } from '@/lib/address'
import { OrderSummary } from '@/components/cart/OrderSummary'
import { usePageTitle } from '@/components/PageMeta'
import { Button } from '@/components/ui/button'
import { DemoNote } from '@/components/ui/demo-note'
import { FieldError, Input, Label } from '@/components/ui/input'
import { resizeImage } from '@/data/images'
import { useCartSummary, type CartLine } from '@/hooks/useCartSummary'
import { estimateDelivery } from '@/lib/delivery'
import { formatINR } from '@/lib/format'
import { EXPRESS_SHIPPING_FEE, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from '@/lib/pricing'
import { PAYMENT_LABELS } from '@/lib/tracking'
import { cn } from '@/lib/utils'
import { emailSchema, phoneSchema } from '@/lib/validation'
import { useAddresses } from '@/store/addresses'
import { useAuth } from '@/store/auth'
import { useCart } from '@/store/cart'
import { generateOrderId, useOrders } from '@/store/orders'
import type { Address, DeliveryMethod, Order, PaymentMethod } from '@/types'

const STEPS = ['Contact', 'Address', 'Delivery', 'Payment', 'Review'] as const

const contactSchema = z.object({ email: emailSchema, phone: phoneSchema })
type Contact = z.infer<typeof contactSchema>

const NO_ADDRESSES: Address[] = []

function StepIndicator({ current, onJump }: { current: number; onJump: (i: number) => void }) {
  return (
    <nav aria-label="Checkout progress">
      <ol className="flex items-center gap-1 sm:gap-2">
        {STEPS.map((label, i) => {
          const done = i < current
          const active = i === current
          return (
            <li key={label} className="flex flex-1 items-center gap-1 sm:gap-2 last:flex-none">
              <button
                type="button"
                disabled={!done}
                onClick={() => onJump(i)}
                aria-current={active ? 'step' : undefined}
                className="flex items-center gap-2 disabled:cursor-default"
              >
                <span
                  className={cn(
                    'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[13px] font-semibold transition-colors',
                    done && 'border-forest bg-forest text-ivory',
                    active && 'border-forest bg-ivory text-forest',
                    !done && !active && 'border-line bg-white text-muted',
                  )}
                >
                  {done ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
                </span>
                <span
                  className={cn('hidden text-[13px] font-medium md:inline', active ? 'text-forest' : done ? 'text-charcoal' : 'text-muted')}
                >
                  {label}
                </span>
                <span className="sr-only">{done ? '(completed)' : active ? '(current step)' : ''}</span>
              </button>
              {i < STEPS.length - 1 && <span className={cn('h-px flex-1', done ? 'bg-forest' : 'bg-line')} aria-hidden />}
            </li>
          )
        })}
      </ol>
      <p className="mt-3 text-[13px] text-muted md:hidden">
        Step {current + 1} of {STEPS.length}: <span className="font-medium text-charcoal">{STEPS[current]}</span>
      </p>
    </nav>
  )
}

function OptionCard({
  checked,
  onSelect,
  name,
  value,
  title,
  description,
  icon,
  aside,
}: {
  checked: boolean
  onSelect: () => void
  name: string
  value: string
  title: string
  description: React.ReactNode
  icon: React.ReactNode
  aside?: React.ReactNode
}) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-4 rounded-lg border bg-white p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-forest sm:p-5',
        checked ? 'border-forest ring-1 ring-forest' : 'border-line hover:border-charcoal/40',
      )}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={onSelect} className="sr-only" />
      <span
        className={cn(
          'mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
          checked ? 'border-forest' : 'border-charcoal/30',
        )}
        aria-hidden
      >
        {checked && <span className="h-2.5 w-2.5 rounded-full bg-forest" />}
      </span>
      <span className="text-forest" aria-hidden>
        {icon}
      </span>
      <span className="flex-1">
        <span className="block text-[15px] font-medium">{title}</span>
        <span className="mt-0.5 block text-[13px] text-muted">{description}</span>
      </span>
      {aside && <span className="text-[14px] font-semibold">{aside}</span>}
    </label>
  )
}

function SummaryLines({ lines }: { lines: CartLine[] }) {
  return (
    <ul className="divide-y divide-line">
      {lines.map(({ item, product }) => (
        <li key={item.key} className="flex gap-3 py-3">
          <span className="relative shrink-0">
            <img src={resizeImage(product.images[0], 120)} alt="" className="h-16 w-13 rounded-md object-cover" />
            <span className="absolute -top-1.5 -right-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-charcoal px-1 text-[11px] text-white">
              {item.quantity}
            </span>
          </span>
          <span className="min-w-0 flex-1">
            <span className="line-clamp-2 text-[13px]">{product.name}</span>
            <span className="text-[12px] text-muted">{[item.color, item.size].filter(Boolean).join(' · ')}</span>
          </span>
          <span className="text-[13px] font-medium">{formatINR(product.price * item.quantity)}</span>
        </li>
      ))}
    </ul>
  )
}

export default function Checkout() {
  usePageTitle('Checkout')
  const [sp] = useSearchParams()
  const source = sp.get('mode') === 'buy-now' ? 'buy-now' : 'bag'
  const navigate = useNavigate()
  const user = useAuth((s) => s.user)
  const saved = useAddresses((s) => (user ? (s.byUser[user.email] ?? NO_ADDRESSES) : NO_ADDRESSES))
  const addAddress = useAddresses((s) => s.add)
  const placeOrder = useOrders((s) => s.place)
  const clearCart = useCart((s) => s.clear)
  const clearBuyNow = useCart((s) => s.clearBuyNow)

  const [step, setStep] = useState(0)
  const [contact, setContact] = useState<Contact | null>(null)
  const [address, setAddress] = useState<AddressData | null>(null)
  const [selectedSaved, setSelectedSaved] = useState<string | null>(() => saved.find((a) => a.isDefault)?.id ?? saved[0]?.id ?? null)
  const [addingNew, setAddingNew] = useState(saved.length === 0)
  const [saveToAccount, setSaveToAccount] = useState(true)
  const [delivery, setDelivery] = useState<DeliveryMethod>('standard')
  const [payment, setPayment] = useState<PaymentMethod>('cod')
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [placing, setPlacing] = useState(false)

  const { lines, summary, couponCode } = useCartSummary({ delivery, source })
  const pin = address?.pincode
  const standardEta = useMemo(() => estimateDelivery(pin, 'standard'), [pin])
  const expressEta = useMemo(() => estimateDelivery(pin, 'express'), [pin])

  const contactForm = useForm<Contact>({
    resolver: zodResolver(contactSchema),
    defaultValues: { email: user?.email ?? '', phone: user?.phone ?? '' },
    mode: 'onTouched',
  })

  const go = (i: number) => {
    setStep(i)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (lines.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-sage">
          <ShoppingBag className="h-8 w-8 text-forest" aria-hidden />
        </span>
        <h1 className="display mt-6 text-4xl">Nothing to check out yet</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Your bag is empty. Add something you love, then come back here to place a demo order.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link to="/shop">Start shopping</Link>
        </Button>
      </div>
    )
  }

  const shippingFeeLabel = summary.subtotal >= FREE_SHIPPING_THRESHOLD ? 'Free' : formatINR(STANDARD_SHIPPING_FEE)

  const confirmSavedAddress = () => {
    const a = saved.find((x) => x.id === selectedSaved)
    if (!a) return
    setAddress(toAddressData(a))
    go(2)
  }

  const submitNewAddress = (values: AddressData) => {
    if (user && saveToAccount) {
      const created = addAddress(user.email, { ...values, isDefault: saved.length === 0 })
      setSelectedSaved(created.id)
      setAddingNew(false)
    }
    setAddress(values)
    go(2)
  }

  const place = () => {
    if (!contact || !address) return
    setPlacing(true)
    const eta = estimateDelivery(address.pincode, delivery)
    const order: Order = {
      id: generateOrderId(),
      createdAt: new Date().toISOString(),
      email: contact.email.trim().toLowerCase(),
      phone: contact.phone,
      address: {
        fullName: address.fullName,
        phone: address.phone,
        pincode: address.pincode,
        line1: address.line1,
        line2: address.line2,
        landmark: address.landmark,
        city: address.city,
        state: address.state,
      },
      delivery,
      payment,
      couponCode: summary.coupon?.code,
      lines: lines.map(({ item, product }) => ({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        image: product.images[0],
        color: item.color,
        size: item.size,
        price: product.price,
        mrp: product.mrp,
        priceUnit: product.priceUnit,
        quantity: item.quantity,
      })),
      summary: {
        subtotal: summary.subtotal,
        mrpTotal: summary.mrpTotal,
        savings: summary.savings,
        couponDiscount: summary.couponDiscount,
        shipping: summary.shipping,
        total: summary.total,
        itemCount: summary.itemCount,
      },
      estimatedDelivery: { from: eta.from, to: eta.to },
    }
    placeOrder(order)
    if (source === 'buy-now') clearBuyNow()
    else clearCart()
    navigate(`/order-confirmation/${order.id}`, { replace: true })
  }

  const summaryBox = (
    <OrderSummary summary={summary} couponCode={couponCode} shippingLabel={delivery === 'express' ? 'Express shipping' : 'Shipping'}>
      <SummaryLines lines={lines} />
      {source === 'bag' && (
        <Link to="/cart" className="mt-3 inline-block text-[13px] text-forest underline underline-offset-4">
          Edit bag or coupon
        </Link>
      )}
    </OrderSummary>
  )

  return (
    <div className="container-page pt-6 pb-4">
      <div className="flex items-center justify-between">
        <h1 className="display text-[34px] sm:text-[40px]">Checkout</h1>
        <p className="flex items-center gap-1.5 text-[13px] text-muted">
          <Lock className="h-4 w-4 text-forest" aria-hidden /> Secure checkout (demo)
        </p>
      </div>
      {source === 'buy-now' && (
        <p className="mt-2 text-[14px] text-muted">
          Buying just this item. Your bag is kept for later.{' '}
          <Link to="/checkout" className="text-forest underline">
            Check out your bag instead
          </Link>
        </p>
      )}

      <div className="mt-6">
        <StepIndicator current={step} onJump={go} />
      </div>

      {/* Mobile summary toggle */}
      <div className="mt-6 lg:hidden">
        <button
          type="button"
          onClick={() => setSummaryOpen((o) => !o)}
          aria-expanded={summaryOpen}
          aria-controls="mobile-summary"
          className="flex w-full items-center justify-between rounded-lg border border-line bg-white px-4 py-3 text-[14px]"
        >
          <span className="flex items-center gap-2 font-medium">
            {summaryOpen ? 'Hide' : 'Show'} order summary{' '}
            <ChevronDown className={cn('h-4 w-4 transition-transform', summaryOpen && 'rotate-180')} aria-hidden />
          </span>
          <span className="font-semibold">{formatINR(summary.total)}</span>
        </button>
        <AnimatePresence initial={false}>
          {summaryOpen && (
            <motion.div
              id="mobile-summary"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-3">{summaryBox}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7 xl:col-span-8">
          <AnimatePresence mode="wait">
            <motion.section
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22 }}
              aria-labelledby="step-title"
              className="rounded-lg border border-line bg-white p-5 sm:p-8"
            >
              <h2 id="step-title" className="font-display text-2xl">
                {step + 1}.{' '}
                {STEPS[step] === 'Contact'
                  ? 'Contact details'
                  : STEPS[step] === 'Address'
                    ? 'Delivery address'
                    : STEPS[step] === 'Delivery'
                      ? 'Delivery method'
                      : STEPS[step] === 'Payment'
                        ? 'Payment method'
                        : 'Review your order'}
              </h2>

              {step === 0 && (
                <form
                  noValidate
                  className="mt-6 space-y-5"
                  onSubmit={contactForm.handleSubmit((v) => {
                    setContact(v)
                    go(1)
                  })}
                >
                  {!user && (
                    <p className="rounded-md bg-sage px-4 py-3 text-[14px]">
                      Checking out as a guest.{' '}
                      <Link to="/login?redirect=%2Fcheckout" className="font-medium text-forest underline">
                        Sign in
                      </Link>{' '}
                      to use saved addresses and see this order in your account.
                    </p>
                  )}
                  <div>
                    <Label htmlFor="co-email">Email address</Label>
                    <Input
                      id="co-email"
                      type="email"
                      autoComplete="email"
                      aria-invalid={Boolean(contactForm.formState.errors.email)}
                      aria-describedby={contactForm.formState.errors.email ? 'co-email-error' : 'co-email-hint'}
                      {...contactForm.register('email')}
                    />
                    <FieldError id="co-email-error" message={contactForm.formState.errors.email?.message} />
                    {!contactForm.formState.errors.email && (
                      <p id="co-email-hint" className="mt-1.5 text-[12px] text-muted">
                        We’d send your order updates here (demo — nothing is sent).
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="co-phone">Mobile number</Label>
                    <div className="flex">
                      <span className="inline-flex h-11 items-center rounded-l-md border border-r-0 border-line bg-sage px-3 text-[14px] text-muted">
                        +91
                      </span>
                      <Input
                        id="co-phone"
                        inputMode="numeric"
                        maxLength={10}
                        autoComplete="tel-national"
                        className="rounded-l-none"
                        aria-invalid={Boolean(contactForm.formState.errors.phone)}
                        aria-describedby={contactForm.formState.errors.phone ? 'co-phone-error' : undefined}
                        {...contactForm.register('phone')}
                      />
                    </div>
                    <FieldError id="co-phone-error" message={contactForm.formState.errors.phone?.message} />
                  </div>
                  <Button type="submit" size="lg">
                    Continue to address
                  </Button>
                </form>
              )}

              {step === 1 && (
                <div className="mt-6">
                  {user && saved.length > 0 && !addingNew ? (
                    <>
                      <fieldset>
                        <legend className="sr-only">Choose a saved address</legend>
                        <div className="grid gap-3">
                          {saved.map((a) => (
                            <OptionCard
                              key={a.id}
                              name="saved-address"
                              value={a.id}
                              checked={selectedSaved === a.id}
                              onSelect={() => setSelectedSaved(a.id)}
                              icon={null}
                              title={`${a.fullName}${a.isDefault ? ' · Default' : ''}`}
                              description={`${a.line1}${a.line2 ? `, ${a.line2}` : ''}, ${a.city}, ${a.state} ${a.pincode} · +91 ${a.phone}`}
                            />
                          ))}
                        </div>
                      </fieldset>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <Button size="lg" onClick={confirmSavedAddress} disabled={!selectedSaved}>
                          Deliver here
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => setAddingNew(true)}>
                          <Plus aria-hidden /> Add a new address
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      {user && (
                        <label className="mb-5 flex items-center gap-2.5 text-[14px]">
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-forest"
                            checked={saveToAccount}
                            onChange={(e) => setSaveToAccount(e.target.checked)}
                          />
                          Save this address to my account
                        </label>
                      )}
                      <AddressForm
                        idPrefix="co-addr"
                        showDefaultToggle={false}
                        submitLabel="Continue to delivery"
                        defaultValues={address ?? { fullName: user?.name ?? '', phone: contact?.phone ?? '' }}
                        onSubmit={submitNewAddress}
                        onCancel={user && saved.length > 0 ? () => setAddingNew(false) : undefined}
                      />
                    </>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="mt-6">
                  <fieldset>
                    <legend className="sr-only">Delivery method</legend>
                    <div className="grid gap-3">
                      <OptionCard
                        name="delivery"
                        value="standard"
                        checked={delivery === 'standard'}
                        onSelect={() => setDelivery('standard')}
                        icon={<Truck className="h-5 w-5" />}
                        title="Standard delivery"
                        description={
                          <>
                            Estimated {standardEta.label} · Free on orders above {formatINR(FREE_SHIPPING_THRESHOLD)}
                          </>
                        }
                        aside={couponCode === 'FREESHIP' ? 'Free' : shippingFeeLabel}
                      />
                      <OptionCard
                        name="delivery"
                        value="express"
                        checked={delivery === 'express'}
                        onSelect={() => setDelivery('express')}
                        icon={<Zap className="h-5 w-5" />}
                        title="Express delivery"
                        description={<>Estimated {expressEta.label} · Priority packing and dispatch</>}
                        aside={formatINR(EXPRESS_SHIPPING_FEE)}
                      />
                    </div>
                  </fieldset>
                  <p className="mt-3 text-[12px] text-muted">Delivery dates are simulated estimates for pincode {address?.pincode}.</p>
                  <Button size="lg" className="mt-6" onClick={() => go(3)}>
                    Continue to payment
                  </Button>
                </div>
              )}

              {step === 3 && (
                <div className="mt-6">
                  <DemoNote className="mb-5">
                    Demo — no real payment is processed. You will never be asked for card or bank details.
                  </DemoNote>
                  <fieldset>
                    <legend className="sr-only">Payment method</legend>
                    <div className="grid gap-3">
                      <OptionCard
                        name="payment"
                        value="cod"
                        checked={payment === 'cod'}
                        onSelect={() => setPayment('cod')}
                        icon={<Banknote className="h-5 w-5" />}
                        title="Cash on Delivery"
                        description="Pay in cash or UPI when your order arrives. Demo — no real payment is processed."
                      />
                      <OptionCard
                        name="payment"
                        value="upi"
                        checked={payment === 'upi'}
                        onSelect={() => setPayment('upi')}
                        icon={<Smartphone className="h-5 w-5" />}
                        title="UPI"
                        description="Google Pay, PhonePe, Paytm or any UPI app. Demo — no real payment is processed."
                      />
                      <OptionCard
                        name="payment"
                        value="card-netbanking"
                        checked={payment === 'card-netbanking'}
                        onSelect={() => setPayment('card-netbanking')}
                        icon={<CreditCard className="h-5 w-5" />}
                        title="Card / Net Banking"
                        description="Credit card, debit card or net banking. Demo — no real payment is processed and no card details are collected."
                      />
                    </div>
                  </fieldset>
                  <Button size="lg" className="mt-6" onClick={() => go(4)}>
                    Review order
                  </Button>
                </div>
              )}

              {step === 4 && contact && address && (
                <div className="mt-6 space-y-6">
                  <dl className="grid gap-4 sm:grid-cols-2">
                    {[
                      {
                        label: 'Contact',
                        step: 0,
                        body: (
                          <>
                            {contact.email}
                            <br />
                            +91 {contact.phone}
                          </>
                        ),
                      },
                      {
                        label: 'Deliver to',
                        step: 1,
                        body: (
                          <>
                            {address.fullName}
                            <br />
                            {address.line1}
                            {address.line2 ? `, ${address.line2}` : ''}
                            <br />
                            {address.city}, {address.state} {address.pincode}
                          </>
                        ),
                      },
                      {
                        label: 'Delivery',
                        step: 2,
                        body: (
                          <>
                            {delivery === 'express' ? 'Express' : 'Standard'} · Estimated{' '}
                            {(delivery === 'express' ? expressEta : standardEta).label}
                          </>
                        ),
                      },
                      { label: 'Payment', step: 3, body: <>{PAYMENT_LABELS[payment]} (demo)</> },
                    ].map((b) => (
                      <div key={b.label} className="rounded-md bg-sage/60 p-4">
                        <div className="flex items-center justify-between">
                          <dt className="text-[12px] font-semibold tracking-[0.12em] text-muted uppercase">{b.label}</dt>
                          <button
                            type="button"
                            onClick={() => go(b.step)}
                            className="inline-flex items-center gap-1 text-[13px] text-forest underline-offset-2 hover:underline"
                            aria-label={`Edit ${b.label.toLowerCase()}`}
                          >
                            <Pencil className="h-3.5 w-3.5" aria-hidden /> Edit
                          </button>
                        </div>
                        <dd className="mt-2 text-[14px] leading-relaxed">{b.body}</dd>
                      </div>
                    ))}
                  </dl>
                  <div>
                    <h3 className="text-[15px] font-semibold">Items</h3>
                    <SummaryLines lines={lines} />
                  </div>
                  <DemoNote>This is a demonstration order. No payment will be taken and nothing will be shipped.</DemoNote>
                  <Button size="lg" className="h-12 w-full sm:w-auto" onClick={place} disabled={placing}>
                    Place Order (Demo) · {formatINR(summary.total)}
                  </Button>
                </div>
              )}
            </motion.section>
          </AnimatePresence>

          {step > 0 && (
            <button type="button" onClick={() => go(step - 1)} className="mt-4 text-[14px] text-forest underline-offset-4 hover:underline">
              ← Back to {STEPS[step - 1].toLowerCase()}
            </button>
          )}
        </div>

        <aside className="hidden lg:col-span-5 lg:block xl:col-span-4" aria-label="Order summary">
          <div className="sticky top-36">{summaryBox}</div>
        </aside>
      </div>
    </div>
  )
}
