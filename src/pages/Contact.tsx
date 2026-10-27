import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { z } from 'zod'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { usePageTitle } from '@/components/PageMeta'
import { Button } from '@/components/ui/button'
import { DemoNote } from '@/components/ui/demo-note'
import { FieldError, Input, Label, Select, Textarea } from '@/components/ui/input'
import { emailSchema, nameSchema } from '@/lib/validation'

const schema = z.object({
  name: nameSchema,
  email: emailSchema,
  topic: z.string().min(1, 'Please choose a topic.'),
  orderId: z.string().trim().max(20).optional(),
  message: z
    .string()
    .trim()
    .min(10, 'Please tell us a little more (at least 10 characters).')
    .max(1000, 'Please keep your message under 1,000 characters.'),
})
type Values = z.infer<typeof schema>

const details = [
  { icon: Mail, label: 'Email', value: '[Support email]' },
  { icon: Phone, label: 'Phone', value: '[Customer care number]' },
  { icon: MessageCircle, label: 'WhatsApp', value: '[WhatsApp number]' },
  { icon: Clock, label: 'Hours', value: '[Support hours]' },
  { icon: MapPin, label: 'Address', value: '[Registered business address]' },
]

const socials = ['Instagram', 'Facebook', 'YouTube', 'Pinterest']

export default function Contact() {
  usePageTitle('Contact us')
  const [sent, setSent] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), mode: 'onTouched', defaultValues: { topic: '' } })

  const a = (name: keyof Values) => ({
    id: `ct-${name}`,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `ct-${name}-error` : undefined,
  })

  return (
    <div className="container-page pt-6">
      <Breadcrumbs items={[{ label: 'Contact' }]} />
      <div className="mt-6 max-w-2xl">
        <h1 className="display text-[40px] leading-tight sm:text-[52px]">We’re here to help</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-muted">
          Questions about an order, sizing, fabric or a return? Send us a message and we’ll reply within one working day. You can also{' '}
          <Link to="/track-order" className="text-forest underline">
            track your order
          </Link>{' '}
          yourself.
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <section aria-labelledby="ct-form-title" className="rounded-lg border border-line bg-white p-6 sm:p-8 lg:col-span-7">
          <h2 id="ct-form-title" className="font-display text-2xl">
            Send us a message
          </h2>
          {sent ? (
            <div role="status" className="mt-6 rounded-lg bg-sage p-6">
              <p className="font-medium">Thank you, {sent}!</p>
              <p className="mt-2 text-[14px] text-charcoal/80">
                Your message has been noted. This is a demo, so nothing was actually sent — in a live store we would reply by email.
              </p>
              <Button className="mt-5" variant="secondary" onClick={() => setSent(null)}>
                Send another message
              </Button>
            </div>
          ) : (
            <form
              noValidate
              className="mt-6 grid gap-5 sm:grid-cols-2"
              onSubmit={handleSubmit((v) => {
                setSent(v.name.split(' ')[0])
                reset()
              })}
            >
              <div>
                <Label htmlFor="ct-name">Your name</Label>
                <Input autoComplete="name" {...a('name')} {...register('name')} />
                <FieldError id="ct-name-error" message={errors.name?.message} />
              </div>
              <div>
                <Label htmlFor="ct-email">Email address</Label>
                <Input type="email" autoComplete="email" {...a('email')} {...register('email')} />
                <FieldError id="ct-email-error" message={errors.email?.message} />
              </div>
              <div>
                <Label htmlFor="ct-topic">Topic</Label>
                <Select {...a('topic')} {...register('topic')}>
                  <option value="" disabled>
                    Choose a topic
                  </option>
                  <option>Order status</option>
                  <option>Returns & exchanges</option>
                  <option>Sizing & fit</option>
                  <option>Product question</option>
                  <option>Something else</option>
                </Select>
                <FieldError id="ct-topic-error" message={errors.topic?.message} />
              </div>
              <div>
                <Label htmlFor="ct-orderId">
                  Order number <span className="font-normal text-muted">(optional)</span>
                </Label>
                <Input placeholder="SM-DEMO-48213" {...a('orderId')} {...register('orderId')} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="ct-message">Message</Label>
                <Textarea rows={5} {...a('message')} {...register('message')} />
                <FieldError id="ct-message-error" message={errors.message?.message} />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" size="lg">
                  Send message
                </Button>
              </div>
            </form>
          )}
        </section>

        <aside className="space-y-6 lg:col-span-5">
          <div className="rounded-lg bg-forest p-6 text-ivory sm:p-8">
            <h2 className="font-display text-2xl">Contact details</h2>
            <ul className="mt-6 space-y-4">
              {details.map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex gap-3">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
                  <span>
                    <span className="block text-[12px] tracking-[0.12em] text-ivory/70 uppercase">{label}</span>
                    <span className="text-[15px]">{value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div id="social" className="scroll-mt-32 rounded-lg border border-line bg-white p-6">
            <h2 className="text-[15px] font-semibold">Follow Sahu Marts</h2>
            <ul className="mt-3 space-y-1.5 text-[14px] text-charcoal/85">
              {socials.map((s) => (
                <li key={s}>
                  {s}: [{s} handle]
                </li>
              ))}
            </ul>
          </div>
          <DemoNote>
            Details in square brackets are placeholders for the client to fill in. This demo does not list a real address, phone number or
            GST number.
          </DemoNote>
        </aside>
      </div>
    </div>
  )
}
