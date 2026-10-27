import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/SectionHeading'
import { StaggerGrid, StaggerItem } from '@/components/motion'
import { budgetHref } from '@/components/layout/nav-data'
import { budgets } from '@/data/budgets'
import { resizeImage } from '@/data/images'
import { getByPriceRange } from '@/lib/catalog'

export function ShopByBudget() {
  return (
    <section aria-labelledby="budget-title" className="bg-sage py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Shop by budget"
          title="Beautiful things, at every price"
          description="Set your budget and we’ll show you everything that fits — from thoughtful little gifts to heirloom pieces."
          id="budget-title"
        />
        <StaggerGrid className="grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {budgets.map((b) => {
            const list = getByPriceRange(b.min, b.max)
            const collage = [...list].sort((a, z) => z.rating - a.rating).slice(0, 3)
            const [prefix, amount] =
              b.max === null ? ['From', `₹${(b.min / 1000).toFixed(0)}k+`] : b.min === 0 ? ['Under', b.shortLabel] : ['Up to', b.shortLabel]
            return (
              <StaggerItem key={b.id}>
                <Link
                  to={budgetHref('/shop', b)}
                  className="group flex h-full flex-col rounded-lg border border-transparent bg-ivory p-5 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-forest/30 hover:shadow-lift"
                >
                  <span className="text-[12px] tracking-[0.18em] text-muted uppercase">{prefix}</span>
                  <span className="mt-1 font-display text-[44px] leading-none text-forest">{amount}</span>
                  <span className="mt-2 text-[13px] text-charcoal/80">{b.label}</span>
                  <span className="mt-5 grid grid-cols-3 gap-1.5" aria-hidden>
                    {collage.map((p) => (
                      <span key={p.id} className="block overflow-hidden rounded-sm bg-sage">
                        <img
                          src={resizeImage(p.images[0], 200)}
                          alt=""
                          loading="lazy"
                          className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </span>
                    ))}
                  </span>
                  <span className="mt-5 flex items-center justify-between text-[13px] font-medium text-forest">
                    {list.length} products
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </Link>
              </StaggerItem>
            )
          })}
        </StaggerGrid>
      </div>
    </section>
  )
}
