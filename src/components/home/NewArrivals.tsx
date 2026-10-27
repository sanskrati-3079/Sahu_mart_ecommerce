import { StaggerGrid, StaggerItem } from '@/components/motion'
import { ProductCard } from '@/components/product/ProductCard'
import { SectionHeading } from '@/components/SectionHeading'
import { getNewArrivals } from '@/lib/catalog'

export function NewArrivals() {
  return (
    <section aria-labelledby="new-title" className="container-page py-16 lg:py-20">
      <SectionHeading
        eyebrow="Just in"
        title="New arrivals"
        description="Fresh weaves, new silhouettes and travel companions — added to the store this season."
        id="new-title"
        action={{ label: 'View all', href: '/shop?sort=newest' }}
      />
      <StaggerGrid className="grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
        {getNewArrivals(8).map((p) => (
          <StaggerItem key={p.id}>
            <ProductCard product={p} />
          </StaggerItem>
        ))}
      </StaggerGrid>
    </section>
  )
}
