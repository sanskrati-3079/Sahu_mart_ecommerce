import { Link } from 'react-router-dom'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Reveal } from '@/components/motion'
import { usePageTitle } from '@/components/PageMeta'
import { Button } from '@/components/ui/button'
import { DemoNote } from '@/components/ui/demo-note'
import { categories } from '@/data/categories'
import { editorial } from '@/data/images'

const values = [
  {
    title: 'Chosen with care',
    text: 'Every piece is picked for its fabric, finish and how it will feel to live with — not just how it photographs.',
  },
  {
    title: 'Honest descriptions',
    text: 'Imitation jewellery is labelled as imitation. Fabrics list their width and composition. Delivery dates are clear estimates.',
  },
  {
    title: 'Fair prices, every budget',
    text: 'From a ₹199 canvas tote to an heirloom Banarasi, you can shop the whole store by the budget that suits you.',
  },
  {
    title: 'Made for Indian homes',
    text: 'Festive wear, everyday cottons, suiting by the metre and luggage built for long journeys — chosen for the way India lives.',
  },
]

export default function About() {
  usePageTitle('About us')
  return (
    <div>
      <div className="container-page pt-6">
        <Breadcrumbs items={[{ label: 'About' }]} />
      </div>
      <section className="container-page grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-20">
        <Reveal>
          <p className="eyebrow">Our story</p>
          <h1 className="display mt-4 text-[44px] leading-[1.05] sm:text-[60px]">Everything You Love. All in One Place.</h1>
          <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-charcoal/80">
            Sahu Marts brings together the things that make a life feel like yours — a silk saree for the wedding season, a crisp shirt for
            Monday, a fabric for your tailor, a trolley for the next journey and a cushion for the sofa at the end of it all.
          </p>
          <DemoNote className="mt-8 max-w-lg">
            Sahu Marts is a demo website created to showcase an online store. The story and values below describe the intended brand.
          </DemoNote>
        </Reveal>
        <Reveal delay={0.1} className="overflow-hidden rounded-lg">
          <img src={editorial.about} alt="Colourful rolls of fabric displayed at a market" className="aspect-[4/3] w-full object-cover" />
        </Reveal>
      </section>

      <section className="bg-sage py-16 lg:py-24">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">What we believe</p>
            <h2 className="display mt-3 text-[36px] leading-tight sm:text-[44px]">A store you can trust</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06} className="rounded-lg bg-ivory p-6">
                <p className="font-display text-3xl text-gold-dark">0{i + 1}</p>
                <h3 className="mt-4 text-[17px] font-semibold">{v.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <Reveal className="overflow-hidden rounded-lg lg:order-2">
          <img
            src={editorial.aboutCraft}
            alt="A tailor arranging fabric swatches on a table"
            className="aspect-[4/3] w-full object-cover"
          />
        </Reveal>
        <Reveal className="lg:order-1">
          <p className="eyebrow">What you’ll find</p>
          <h2 className="display mt-3 text-[36px] leading-tight sm:text-[44px]">Twelve categories, one point of view</h2>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
            Our house labels — Sahu Heritage, Sahu Studio, Sahu Tailored, Sahu Loom, Sahu Adorn, Sahu Home, Sahu Daily and Voyager by Sahu —
            each look after one part of the store, so every category gets the attention it deserves.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  to={`/category/${c.slug}`}
                  className="inline-block rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] hover:border-forest hover:text-forest"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="mt-8">
            <Link to="/shop">Explore the store</Link>
          </Button>
        </Reveal>
      </section>
    </div>
  )
}
