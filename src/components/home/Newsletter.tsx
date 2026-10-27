import { Reveal } from '@/components/motion'
import { NewsletterForm } from '@/components/NewsletterForm'
import { DemoBadge } from '@/components/ui/demo-note'

export function Newsletter() {
  return (
    <section aria-labelledby="newsletter-title" className="container-page pt-16 lg:pt-24">
      <Reveal className="grid items-center gap-8 rounded-lg bg-sage px-6 py-12 sm:px-12 lg:grid-cols-2 lg:px-16 lg:py-16">
        <div>
          <p className="eyebrow flex items-center gap-2">
            The Sahu Marts letter <DemoBadge />
          </p>
          <h2 id="newsletter-title" className="display mt-3 text-[32px] leading-tight sm:text-[40px]">
            First look at new arrivals and seasonal edits
          </h2>
          <p className="mt-3 max-w-md text-[15px] text-muted">One or two thoughtful emails a month. Unsubscribe anytime.</p>
        </div>
        <NewsletterForm />
      </Reveal>
    </section>
  )
}
