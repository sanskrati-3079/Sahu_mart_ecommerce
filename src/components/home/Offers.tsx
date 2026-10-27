import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/motion'
import { SectionHeading } from '@/components/SectionHeading'
import { editorial } from '@/data/images'

const offers = [
  {
    title: 'Festive Edit',
    text: 'Silk sarees, kurta sets and gold-tone jewellery for poojas and family evenings.',
    cta: 'Shop festive',
    href: '/shop?occasion=Festive',
    image: editorial.festive,
    alt: 'A woman in a red and gold saree with traditional jewellery',
  },
  {
    title: 'Wedding Season',
    text: 'Bridal Banarasis, lehengas, sherwanis and complete jewellery sets.',
    cta: 'Shop wedding',
    href: '/shop?occasion=Wedding',
    image: editorial.wedding,
    alt: 'A couple in traditional Indian wedding attire by a river',
  },
  {
    title: 'Travel Deals',
    text: 'Special prices on selected trolleys and weekenders from Voyager by Sahu.',
    cta: 'Shop travel',
    href: '/category/luggage?discount=10',
    image: editorial.travel,
    alt: 'A dark cabin trolley standing in an airport terminal',
  },
  {
    title: 'Everyday under ₹999',
    text: 'Towels, bottles, totes, jhumkas and fabrics — small joys at easy prices.',
    cta: 'Shop under ₹999',
    href: '/shop?max=999',
    image: editorial.everyday,
    alt: 'Ceramic bowls and plates stacked on white shelves',
  },
]

export function Offers() {
  return (
    <section aria-labelledby="offers-title" className="container-page py-16 lg:py-24">
      <SectionHeading
        eyebrow="Offers & seasonal"
        title="For every occasion this season"
        id="offers-title"
        description="Special prices across selected collections. No countdowns, no pressure — just good things at fair prices."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
        {offers.map((o, i) => (
          <Reveal key={o.title} delay={i * 0.05}>
            <Link
              to={o.href}
              className="group grid h-full grid-cols-5 overflow-hidden rounded-lg bg-white shadow-soft transition-shadow hover:shadow-lift"
            >
              <div className="relative col-span-2 min-h-52 overflow-hidden bg-sage">
                <img
                  src={o.image}
                  alt={o.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="col-span-3 flex flex-col justify-center p-5 sm:p-7">
                <h3 className="display text-2xl sm:text-[28px]">{o.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{o.text}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-forest">
                  {o.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
