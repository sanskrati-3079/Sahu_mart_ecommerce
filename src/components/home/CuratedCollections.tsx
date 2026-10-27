import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/motion'
import { SectionHeading } from '@/components/SectionHeading'
import { Button } from '@/components/ui/button'
import { collections } from '@/data/collections'
import { resizeImage } from '@/data/images'
import { getProductsByIds } from '@/lib/catalog'
import { formatINR } from '@/lib/format'
import { cn } from '@/lib/utils'

export function CuratedCollections() {
  return (
    <section aria-labelledby="collections-title" className="container-page py-16 lg:py-24">
      <SectionHeading eyebrow="Curated collections" title="Edits, thoughtfully put together" id="collections-title" align="center" />
      <div className="space-y-16 lg:space-y-24">
        {collections.map((c, i) => {
          const items = getProductsByIds(c.productIds).slice(0, 3)
          const flip = i % 2 === 1
          return (
            <article key={c.slug} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
              <Reveal className={cn('lg:col-span-7', flip && 'lg:order-2')}>
                <Link to={c.href} className="group block overflow-hidden rounded-lg" aria-label={`Shop ${c.title}`}>
                  <img
                    src={c.image}
                    alt=""
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] lg:aspect-[16/11]"
                  />
                </Link>
              </Reveal>
              <Reveal className={cn('lg:col-span-5', flip && 'lg:order-1')} delay={0.1}>
                <p className="eyebrow">
                  {String(i + 1).padStart(2, '0')} — {c.subtitle}
                </p>
                <h3 className="display mt-4 text-[34px] leading-tight sm:text-[44px]">{c.title}</h3>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">{c.description}</p>
                <ul className="mt-7 grid grid-cols-3 gap-3">
                  {items.map((p) => (
                    <li key={p.id}>
                      <Link to={`/product/${p.slug}`} className="group block">
                        <span className="block overflow-hidden rounded-md bg-sage">
                          <img
                            src={resizeImage(p.images[0], 300)}
                            alt={p.name}
                            loading="lazy"
                            className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </span>
                        <span className="mt-2 line-clamp-1 block text-[12px] text-charcoal">{p.name}</span>
                        <span className="block text-[12px] font-semibold">{formatINR(p.price)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Button asChild variant="secondary" className="mt-8">
                  <Link to={c.href}>
                    Shop the edit <ArrowRight aria-hidden />
                  </Link>
                </Button>
              </Reveal>
            </article>
          )
        })}
      </div>
    </section>
  )
}
