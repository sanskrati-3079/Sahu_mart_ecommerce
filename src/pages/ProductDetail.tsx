import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { usePageTitle } from '@/components/PageMeta'
import { QuantityStepper } from '@/components/cart/QuantityStepper'
import { Gallery } from '@/components/product/Gallery'
import { PincodeChecker } from '@/components/product/PincodeChecker'
import { Price } from '@/components/product/Price'
import { ProductRow } from '@/components/product/ProductRow'
import { Rating } from '@/components/product/Rating'
import { Reviews } from '@/components/product/Reviews'
import { SizeGuideDialog } from '@/components/product/SizeGuideDialog'
import { VariantSelector } from '@/components/product/VariantSelector'
import { WishlistButton } from '@/components/product/WishlistButton'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { useAddToCart } from '@/hooks/useAddToCart'
import { getCategory, getProductBySlug, getProductsByIds, getRelated, isInStock } from '@/lib/catalog'
import { formatINR } from '@/lib/format'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/pricing'
import { cn } from '@/lib/utils'
import { defaultSelection, findVariant, quantityLabel, selectionHint, sizeStock } from '@/lib/variants'
import { useCart } from '@/store/cart'
import { usePreferences } from '@/store/preferences'
import type { Product } from '@/types'
import NotFound from './NotFound'

export default function ProductDetail() {
  const { slug = '' } = useParams()
  const product = getProductBySlug(slug)
  usePageTitle(product?.name ?? 'Product not found')
  if (!product)
    return (
      <NotFound
        title="Product not found"
        message="This product may have been removed or the link is incorrect. Explore our latest collections instead."
      />
    )
  return <ProductView key={product.id} product={product} />
}

function ProductView({ product }: { product: Product }) {
  const initial = defaultSelection(product)
  const [color, setColor] = useState(initial.color)
  const [size, setSize] = useState(initial.size)
  const [qty, setQty] = useState(1)
  const [tried, setTried] = useState(false)
  const addToCart = useAddToCart()
  const setBuyNow = useCart((s) => s.setBuyNow)
  const navigate = useNavigate()
  const { recentlyViewed, addViewed } = usePreferences()
  const [recentIds] = useState(() => recentlyViewed.filter((id) => id !== product.id))

  useEffect(() => addViewed(product.id), [product.id, addViewed])

  const variant = findVariant(product, color, size)
  const hint = selectionHint(product, color, size)
  const stock = variant?.stock ?? 0
  const anyStock = isInStock(product)
  const category = getCategory(product.category)
  const saving = product.mrp - product.price
  const related = useMemo(() => getRelated(product, 10), [product])
  const recent = useMemo(() => getProductsByIds(recentIds).slice(0, 10), [recentIds])

  useEffect(() => {
    if (qty > Math.max(1, stock)) setQty(Math.max(1, stock))
  }, [stock, qty])

  const ready = () => {
    setTried(true)
    return !hint && variant && variant.stock > 0 ? variant : null
  }

  const onAdd = () => {
    const v = ready()
    if (v) addToCart(product, v, qty)
  }

  const onBuyNow = () => {
    const v = ready()
    if (!v) return
    setBuyNow({ productId: product.id, sku: v.sku, color: v.color, size: v.size, quantity: qty })
    navigate('/checkout?mode=buy-now')
  }

  const stockStatus = !anyStock
    ? { text: 'Out of stock', cls: 'text-sale' }
    : variant
      ? variant.stock === 0
        ? { text: 'This option is out of stock', cls: 'text-sale' }
        : variant.stock <= 5
          ? { text: `Only ${variant.stock} left`, cls: 'text-sale' }
          : { text: 'In stock', cls: 'text-success' }
      : { text: 'In stock', cls: 'text-success' }

  const care = product.attributes.Care
  const specs = Object.entries(product.attributes).filter(([k]) => k !== 'Care')

  return (
    <div className="container-page pt-6">
      <Breadcrumbs
        items={[
          { label: 'Shop', href: '/shop' },
          ...(category ? [{ label: category.name, href: `/category/${category.slug}` }] : []),
          {
            label: product.subcategory,
            href: category ? `/category/${category.slug}?sub=${encodeURIComponent(product.subcategory)}` : undefined,
          },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-36">
            <Gallery images={product.images} alt={product.name} />
          </div>
        </div>

        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p className="text-[12px] tracking-[0.14em] text-muted uppercase">{product.brand}</p>
          <h1 className="display mt-2 text-[30px] leading-tight sm:text-[38px]">{product.name}</h1>
          <a href="#reviews" className="mt-3 inline-block hover:underline" aria-label={`Rated ${product.rating} out of 5. Go to reviews`}>
            <Rating value={product.rating} count={product.reviewCount} />
          </a>

          <div className="mt-6 border-t border-line pt-6">
            <Price product={product} size="lg" />
            {saving > 0 && <p className="mt-1 text-[14px] font-medium text-success">You save {formatINR(saving)}</p>}
            <p className="mt-1 text-[13px] text-muted">
              Inclusive of all taxes
              {product.priceUnit === 'per metre' && (
                <> · Price per metre{product.attributes.Width ? ` · Width ${product.attributes.Width}` : ''}</>
              )}
              {product.priceUnit === 'per set' && <> · Price per set</>}
            </p>
          </div>

          <div className="mt-7">
            <VariantSelector
              product={product}
              color={color}
              size={size}
              idPrefix="pdp"
              showError={tried}
              onColor={(c) => {
                setColor(c)
                if (size && sizeStock(product, size, c) === 0) setSize(undefined)
              }}
              onSize={setSize}
              sizeGuideSlot={product.sizeGuide ? <SizeGuideDialog kind={product.sizeGuide} /> : undefined}
            />
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <div>
              <p className="mb-2 text-[13px] font-medium">{quantityLabel(product)}</p>
              <QuantityStepper value={qty} max={Math.max(1, stock)} onChange={setQty} label={quantityLabel(product)} size="md" />
            </div>
            <p className={cn('mt-6 text-[14px] font-medium', stockStatus.cls)} aria-live="polite">
              {stockStatus.text}
            </p>
          </div>

          <p className={cn('mt-4 min-h-5 text-[13px]', tried ? 'text-sale' : 'text-muted')} role={tried ? 'alert' : undefined}>
            {anyStock && hint}
          </p>

          {anyStock ? (
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <Button size="lg" className="h-12" onClick={onAdd} disabled={Boolean(variant && variant.stock === 0)}>
                Add to bag
              </Button>
              <Button size="lg" variant="secondary" className="h-12" onClick={onBuyNow} disabled={Boolean(variant && variant.stock === 0)}>
                Buy now
              </Button>
              <WishlistButton product={product} variant="full" className="sm:col-span-2" />
            </div>
          ) : (
            <div className="mt-2 grid gap-3">
              <Button size="lg" className="h-12" disabled>
                Out of stock
              </Button>
              <WishlistButton product={product} variant="full" />
              <p className="text-[13px] text-muted">Save it to your wishlist and check back soon.</p>
            </div>
          )}

          <div className="mt-8">
            <PincodeChecker />
          </div>

          <ul className="mt-6 grid grid-cols-3 gap-3 text-center text-[12px] text-charcoal/80">
            <li className="rounded-md bg-sage px-2 py-3">
              <Truck className="mx-auto mb-1.5 h-4 w-4 text-forest" aria-hidden />
              Free delivery over {formatINR(FREE_SHIPPING_THRESHOLD)}
            </li>
            <li className="rounded-md bg-sage px-2 py-3">
              <RotateCcw className="mx-auto mb-1.5 h-4 w-4 text-forest" aria-hidden />
              7-day easy returns
            </li>
            <li className="rounded-md bg-sage px-2 py-3">
              <ShieldCheck className="mx-auto mb-1.5 h-4 w-4 text-forest" aria-hidden />
              Secure checkout
            </li>
          </ul>

          <Accordion type="multiple" defaultValue={['description']} className="mt-8 border-t border-line">
            <AccordionItem value="description">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent className="text-[14px] leading-relaxed text-charcoal/85">
                <p>{product.description}</p>
                {product.category === 'jewellery' && (
                  <p className="mt-3 text-[13px] text-muted">
                    This is imitation (fashion) jewellery. It is not made of gold, silver or precious stones.
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="specs">
              <AccordionTrigger>Specifications</AccordionTrigger>
              <AccordionContent>
                <table className="w-full text-left text-[14px]">
                  <caption className="sr-only">Specifications</caption>
                  <tbody>
                    {[
                      ['Brand', product.brand],
                      ['Category', product.subcategory],
                      ...specs,
                      ['Colour', product.colors.map((c) => c.name).join(', ') || '—'],
                      ...(product.sizes.length ? [['Options', product.sizes.join(', ')]] : []),
                      ['Product code', product.id.toUpperCase()],
                    ].map(([k, v]) => (
                      <tr key={k} className="border-b border-line/70 last:border-0">
                        <th scope="row" className="w-2/5 py-2.5 pr-4 align-top font-medium text-muted">
                          {k}
                        </th>
                        <td className="py-2.5">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="care">
              <AccordionTrigger>Material & Care</AccordionTrigger>
              <AccordionContent className="space-y-2 text-[14px] leading-relaxed text-charcoal/85">
                <p>
                  <span className="font-medium">Material:</span> {product.material}
                </p>
                <p>
                  <span className="font-medium">Care:</span> {care ?? 'Wipe clean with a soft, dry cloth. Store in a cool, dry place.'}
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping & Returns</AccordionTrigger>
              <AccordionContent className="space-y-2 text-[14px] leading-relaxed text-charcoal/85">
                <p>
                  Free standard delivery on orders above {formatINR(FREE_SHIPPING_THRESHOLD)}; ₹79 otherwise. Express delivery is available
                  for ₹149.
                </p>
                <p>
                  Easy 7-day returns on unused items with original tags.{' '}
                  {product.priceUnit === 'per metre' && 'Fabric cut to length is not returnable unless it arrives damaged. '}
                  Read our{' '}
                  <Link to="/returns-policy" className="text-forest underline">
                    returns policy
                  </Link>{' '}
                  and{' '}
                  <Link to="/shipping-policy" className="text-forest underline">
                    shipping policy
                  </Link>
                  .
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>

      <div className="mt-20">
        <Reviews product={product} />
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="mt-20">
          <h2 id="related-title" className="display -mb-10 text-[32px]">
            You may also like
          </h2>
          <ProductRow products={related} label="Related products" />
        </section>
      )}

      {recent.length > 0 && (
        <section aria-labelledby="recent-title" className="mt-20">
          <h2 id="recent-title" className="display -mb-10 text-[32px]">
            Recently viewed
          </h2>
          <ProductRow products={recent} label="Recently viewed products" />
        </section>
      )}
    </div>
  )
}
