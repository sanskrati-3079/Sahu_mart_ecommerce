import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { ChevronRight, Heart, MapPin, Package } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { AccountShell } from '@/components/account/AccountShell'
import { usePageTitle } from '@/components/PageMeta'
import { Button } from '@/components/ui/button'
import { DemoNote } from '@/components/ui/demo-note'
import { FieldError, Input, Label } from '@/components/ui/input'
import { nameSchema, phoneSchema } from '@/lib/validation'
import { useAddresses } from '@/store/addresses'
import { firstName, useAuth } from '@/store/auth'
import { useOrders } from '@/store/orders'
import { useWishlist } from '@/store/wishlist'

const schema = z.object({ name: nameSchema, phone: z.union([z.literal(''), phoneSchema]) })
type Values = z.infer<typeof schema>

export default function Account() {
  usePageTitle('My account')
  const { user, updateProfile } = useAuth()
  const orderCount = useOrders((s) => s.orders.filter((o) => o.email === user?.email).length)
  const addressCount = useAddresses((s) => (user ? (s.byUser[user.email]?.length ?? 0) : 0))
  const wishCount = useWishlist((s) => s.ids.length)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name ?? '', phone: user?.phone ?? '' },
    mode: 'onTouched',
  })

  const cards = [
    { to: '/account/orders', label: 'Orders', text: `${orderCount} ${orderCount === 1 ? 'order' : 'orders'} placed`, icon: Package },
    { to: '/account/addresses', label: 'Addresses', text: `${addressCount} saved`, icon: MapPin },
    { to: '/wishlist', label: 'Wishlist', text: `${wishCount} ${wishCount === 1 ? 'item' : 'items'} saved`, icon: Heart },
  ]

  return (
    <AccountShell title={`Hello, ${firstName(user)}`}>
      <ul className="grid gap-4 sm:grid-cols-3">
        {cards.map(({ to, label, text, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              className="group flex items-center gap-4 rounded-lg border border-line bg-white p-5 transition-shadow hover:shadow-soft"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-sage text-forest">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="flex-1">
                <span className="block font-medium">{label}</span>
                <span className="block text-[13px] text-muted">{text}</span>
              </span>
              <ChevronRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 max-w-xl rounded-lg border border-line bg-white p-6 sm:p-8">
        <h2 className="font-display text-2xl">Profile</h2>
        <form
          className="mt-6 space-y-5"
          noValidate
          onSubmit={handleSubmit((v) => {
            updateProfile({ name: v.name.trim(), phone: v.phone || undefined })
            reset(v)
            toast.success('Profile updated')
          })}
        >
          <div>
            <Label htmlFor="acc-name">Full name</Label>
            <Input
              id="acc-name"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'acc-name-error' : undefined}
              {...register('name')}
            />
            <FieldError id="acc-name-error" message={errors.name?.message} />
          </div>
          <div>
            <Label htmlFor="acc-email">Email address</Label>
            <Input id="acc-email" value={user?.email ?? ''} readOnly disabled aria-describedby="acc-email-hint" />
            <p id="acc-email-hint" className="mt-1.5 text-[12px] text-muted">
              Your email identifies your demo account and can’t be changed.
            </p>
          </div>
          <div>
            <Label htmlFor="acc-phone">
              Mobile number <span className="font-normal text-muted">(optional)</span>
            </Label>
            <Input
              id="acc-phone"
              inputMode="numeric"
              maxLength={10}
              autoComplete="tel-national"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'acc-phone-error' : undefined}
              {...register('phone')}
            />
            <FieldError id="acc-phone-error" message={errors.phone?.message} />
          </div>
          <Button type="submit" disabled={!isDirty}>
            Save changes
          </Button>
        </form>
        <DemoNote className="mt-6">Your profile is saved only in this browser. No password is stored.</DemoNote>
      </div>
    </AccountShell>
  )
}
