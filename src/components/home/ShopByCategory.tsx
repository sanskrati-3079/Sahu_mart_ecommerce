import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '@/components/SectionHeading'
import { StaggerGrid, StaggerItem } from '@/components/motion'
import { unsplash } from '@/data/images'
import { getByCategory } from '@/lib/catalog'
import { cn } from '@/lib/utils'

const tiles = [
  {
    label: 'Sarees',
    href: '/category/sarees',
    slug: 'sarees',
    img: '1641699862936-be9f49b1c38d',
    alt: 'A woman in a purple and gold silk saree',
    span: 'col-span-2 row-span-2 lg:col-span-2 lg:row-span-2',
    tall: true,
  },
  {
    label: 'Jewellery',
    href: '/category/jewellery',
    slug: 'jewellery',
    img: '1762686130435-897de4b26aac',
    alt: 'Rows of ornate oxidised jhumka earrings',
    span: '',
  },
  {
    label: 'Kurtas & Ethnic Wear',
    href: '/category/kurtas',
    slug: 'kurtas',
    img: '1745313452052-0e4e341f326c',
    alt: 'A woman in a white block-printed kurta set',
    span: '',
  },
  {
    label: 'Shirts & Trousers',
    href: '/category/mens-clothing',
    slug: 'mens-clothing',
    img: '1624835567150-0c530a20d8cc',
    alt: 'A man in a light blue shirt and navy trousers',
    span: '',
  },
  {
    label: 'Suiting & Shirting Fabrics',
    href: '/category/shirting-fabrics',
    slug: 'shirting-fabrics',
    img: '1771098403216-ca0c3c2858c0',
    alt: 'Rolls of colourful patterned fabric stacked on shelves',
    span: '',
  },
  {
    label: 'Trolley Bags',
    href: '/category/luggage',
    slug: 'luggage',
    img: '1639598003276-8a70fcaaad6c',
    alt: 'Three blue hard-shell trolley suitcases',
    span: 'col-span-2 lg:col-span-2',
    wide: true,
  },
  {
    label: 'Home & Living',
    href: '/category/home-living',
    slug: 'home-living',
    img: '1781888693414-ab97da521f2c',
    alt: 'Rust velvet cushions on a white sofa',
    span: 'col-span-2 lg:col-span-2',
    wide: true,
  },
]

export function ShopByCategory() {
  return (
    <section aria-labelledby="cat-title" className="container-page py-16 lg:py-24">
      <SectionHeading
        eyebrow="Shop by category"
        title="Everything you love, beautifully arranged"
        id="cat-title"
        action={{ label: 'View all products', href: '/shop' }}
      />
      <StaggerGrid className="auto-rows-[200px] grid-cols-2 gap-3 sm:auto-rows-[240px] sm:gap-4 lg:auto-rows-[260px] lg:grid-cols-4">
        {tiles.map((t) => (
          <StaggerItem key={t.label} className={cn(t.span)}>
            <Link to={t.href} className="group relative block h-full overflow-hidden rounded-lg bg-sage">
              <img
                src={unsplash(t.img, t.tall || t.wide ? 1000 : 600)}
                alt={t.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <span className="absolute right-3 bottom-3 left-3 flex items-center justify-between gap-3 rounded-md bg-ivory/95 px-4 py-3 sm:right-auto sm:min-w-[60%]">
                <span>
                  <span
                    className={cn('block font-display leading-tight text-charcoal', t.tall ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl')}
                  >
                    {t.label}
                  </span>
                  <span className="mt-0.5 block text-[12px] text-muted">{getByCategory(t.slug).length} products</span>
                </span>
                <ArrowUpRight
                  className="h-4 w-4 shrink-0 text-forest transition-transform duration-300 group-hover:rotate-45"
                  aria-hidden
                />
              </span>
            </Link>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </section>
  )
}
