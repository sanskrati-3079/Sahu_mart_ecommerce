import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { editorial } from '@/data/images'

const EASE = [0.2, 0.8, 0.2, 1] as const

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="container-page grid items-center gap-12 pt-8 pb-16 sm:pt-12 lg:grid-cols-12 lg:gap-8 lg:pt-16 lg:pb-24"
    >
      <div className="lg:col-span-5">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          The new season at Sahu Marts
        </motion.p>
        <motion.h1
          id="hero-title"
          className="display mt-5 text-[44px] leading-[1.04] sm:text-[60px] lg:text-[54px] xl:text-[72px]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
        >
          Your World. Your Style. <em className="text-forest italic">Your Sahu Marts.</em>
        </motion.h1>
        <motion.p
          className="mt-6 max-w-md text-[17px] leading-relaxed text-charcoal/80"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16, ease: EASE }}
        >
          From timeless Indian elegance to everyday essentials, discover pieces that feel like they were made for you.
        </motion.p>
        <motion.div
          className="mt-9 flex flex-col gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24, ease: EASE }}
        >
          <Button asChild size="lg">
            <Link to="/shop">
              Explore Collections <ArrowRight aria-hidden />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to="/shop?sort=bestselling">Shop Bestsellers</Link>
          </Button>
        </motion.div>
        <motion.dl
          className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {[
            ['12', 'Categories'],
            ['Free', 'Delivery over ₹999'],
            ['7-day', 'Easy returns'],
          ].map(([v, l]) => (
            <div key={l}>
              <dt className="sr-only">{l}</dt>
              <dd>
                <span className="block font-display text-2xl text-forest">{v}</span>
                <span className="mt-1 block text-[12px] leading-snug text-muted">{l}</span>
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>

      <div className="relative lg:col-span-7">
        <div className="relative ml-auto w-[86%] sm:w-[78%]">
          <motion.div
            className="overflow-hidden rounded-lg"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          >
            <motion.img
              src={editorial.heroFashion}
              alt="A woman in a pink and orange silk saree with gold jewellery, standing between trees"
              className="aspect-[4/5] w-full object-cover"
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2, ease: EASE }}
              fetchPriority="high"
            />
          </motion.div>
          <motion.p
            className="absolute top-5 -left-3 rounded-sm bg-ivory px-3 py-2 text-[11px] font-semibold tracking-[0.18em] text-forest uppercase shadow-soft sm:-left-6"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            The Saree Edit
          </motion.p>
        </div>
        <motion.div
          className="absolute bottom-[-8%] left-0 w-[44%] overflow-hidden rounded-lg border-[6px] border-ivory shadow-lift sm:w-[38%]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
        >
          <img
            src={editorial.heroTravel}
            alt="A traveller wheeling a white cabin trolley through a doorway"
            className="aspect-[3/4] w-full object-cover"
          />
          <Link
            to="/category/luggage"
            className="absolute inset-x-0 bottom-0 bg-ivory/95 px-3 py-2.5 text-[12px] font-medium text-forest transition-colors hover:bg-white sm:text-[13px]"
          >
            Travel, beautifully done →
          </Link>
        </motion.div>
        <span className="absolute top-[12%] left-[6%] hidden h-24 w-24 rounded-full border border-gold/60 lg:block" aria-hidden />
      </div>
    </section>
  )
}
