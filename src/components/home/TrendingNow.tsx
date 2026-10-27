import { ProductRow } from '@/components/product/ProductRow'
import { SectionHeading } from '@/components/SectionHeading'
import { getBestsellers } from '@/lib/catalog'

export function TrendingNow() {
  return (
    <section aria-labelledby="trending-title" className="container-page py-16 lg:py-20">
      <SectionHeading
        eyebrow="Trending now"
        title="What everyone is loving"
        id="trending-title"
        action={{ label: 'Shop bestsellers', href: '/shop?sort=bestselling' }}
      />
      <ProductRow products={getBestsellers(12)} label="Trending products" />
    </section>
  )
}
