import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/SectionHeading'
import { Swatch } from '@/components/product/VariantSelector'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { resizeImage, unsplash } from '@/data/images'
import { getProductsByIds } from '@/lib/catalog'
import { formatINR } from '@/lib/format'
import type { Product } from '@/types'

const edits = [
  {
    id: 'sarees',
    label: 'Sarees',
    image: unsplash('1732381917488-39f31539cd4f', 1200),
    alt: 'A woman in a royal blue and gold Banarasi saree',
    title: 'Woven in Banaras, worn everywhere',
    text: 'Zari borders, Katan silks and soft cottons — each saree is chosen for its weave, its fall and how it feels by the end of a long celebration.',
    ids: ['sm-sar-002', 'sm-sar-001', 'sm-sar-006', 'sm-sar-009'],
    href: '/category/sarees',
    keys: ['Fabric', 'Weave', 'Length'],
  },
  {
    id: 'jewellery',
    label: 'Jewellery',
    image: unsplash('1756483560049-e7b2208f99a0', 1200),
    alt: 'A smiling woman wearing a Kundan-style necklace and earrings',
    title: 'Gold-tone, Kundan-style and oxidised',
    text: 'Honest imitation jewellery with a rich finish: jhumkas for everyday, chokers for festivals and complete sets for the bride.',
    ids: ['sm-jew-003', 'sm-jew-001', 'sm-jew-007', 'sm-jew-002'],
    href: '/category/jewellery',
    keys: ['Material', 'Stones', 'Closure'],
  },
  {
    id: 'menswear',
    label: 'Menswear',
    image: unsplash('1734418038940-2e5ee6a1b478', 1200),
    alt: 'A man in a white kurta sitting outdoors',
    title: 'Tailored, relaxed, ready',
    text: 'Linen-blend shirts, slim formal trousers and a chikankari kurta for every celebration — the modern Indian wardrobe, simplified.',
    ids: ['sm-kur-008', 'sm-shi-001', 'sm-tro-001', 'sm-kur-007'],
    href: '/category/mens-clothing',
    keys: ['Fabric', 'Fit', 'Collar'],
  },
  {
    id: 'travel',
    label: 'Travel',
    image: unsplash('1670888616427-764112453941', 1200),
    alt: 'A charcoal hard-shell suitcase standing beside a plant',
    title: 'Voyager by Sahu',
    text: 'Polycarbonate shells, whisper-quiet spinner wheels and TSA-approved locks. Luggage that looks as good on arrival as it did at departure.',
    ids: ['sm-lug-001', 'sm-lug-003', 'sm-lug-007', 'sm-lug-008'],
    href: '/category/luggage',
    keys: ['Dimensions', 'Capacity', 'Wheel type'],
  },
]

function EditProduct({ product, keys }: { product: Product; keys: string[] }) {
  const details = keys.map((k) => [k, product.attributes[k]] as const).filter(([, v]) => Boolean(v))
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group relative block overflow-hidden rounded-lg bg-sage focus-visible:outline-offset-4"
    >
      <img
        src={resizeImage(product.images[0], 500)}
        alt=""
        loading="lazy"
        className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105 lg:aspect-square"
      />
      <div className="absolute inset-x-2 bottom-2 rounded-md bg-ivory/95 p-3 transition-transform duration-300">
        <p className="line-clamp-1 text-[13px] font-medium text-charcoal">{product.name}</p>
        <p className="text-[13px] font-semibold text-forest">{formatINR(product.price)}</p>
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
          <dl className="overflow-hidden text-[12px] leading-relaxed text-muted">
            <div className="pt-2" />
            {details.map(([k, v]) => (
              <div key={k} className="flex gap-1.5">
                <dt className="shrink-0 text-charcoal">{k}:</dt>
                <dd className="line-clamp-1">{v}</dd>
              </div>
            ))}
            {product.colors.length > 0 && (
              <div className="mt-1.5 flex items-center gap-1.5">
                <dt className="sr-only">Colours</dt>
                {product.colors.map((c) => (
                  <dd key={c.name} title={c.name}>
                    <Swatch hex={c.hex} className="h-3.5 w-3.5" />
                    <span className="sr-only">{c.name}</span>
                  </dd>
                ))}
              </div>
            )}
          </dl>
        </div>
      </div>
    </Link>
  )
}

export function SahuEdit() {
  return (
    <section aria-labelledby="edit-title" className="bg-white py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="The Sahu Marts edit"
          title="Look closer — the details make it"
          id="edit-title"
          description="Hover over a piece to see its fabric, craft, dimensions and colours."
        />
        <Tabs defaultValue="sarees">
          <TabsList aria-label="Edit categories">
            {edits.map((e) => (
              <TabsTrigger key={e.id} value={e.id}>
                {e.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {edits.map((e) => (
            <TabsContent key={e.id} value={e.id} className="mt-8 focus-visible:outline-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid gap-6 lg:grid-cols-12 lg:gap-8"
                >
                  <div className="relative overflow-hidden rounded-lg lg:col-span-5 lg:min-h-[560px]">
                    <img
                      src={e.image}
                      alt={e.alt}
                      loading="lazy"
                      className="aspect-[4/5] h-full w-full object-cover lg:absolute lg:inset-0 lg:aspect-auto"
                    />
                    <div className="absolute inset-x-4 bottom-4 rounded-md bg-ivory/95 p-5 sm:inset-x-6 sm:bottom-6">
                      <p className="display text-2xl leading-snug">{e.title}</p>
                      <p className="mt-2 text-[14px] leading-relaxed text-muted">{e.text}</p>
                      <Button asChild className="mt-4" size="sm">
                        <Link to={e.href}>
                          Discover the Collection <ArrowRight aria-hidden />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:col-span-7">
                    {getProductsByIds(e.ids).map((p) => (
                      <li key={p.id}>
                        <EditProduct product={p} keys={e.keys} />
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
