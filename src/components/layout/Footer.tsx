import { Link } from 'react-router-dom'
import { Logo } from '@/components/brand/Logo'
import { NewsletterForm } from '@/components/NewsletterForm'
import { categories } from '@/data/categories'

const help = [
  { label: 'Track your order', href: '/track-order' },
  { label: 'Shipping & delivery', href: '/shipping-policy' },
  { label: 'Returns & exchanges', href: '/returns-policy' },
  { label: 'Contact us', href: '/contact' },
  { label: 'My account', href: '/account' },
]

const company = [
  { label: 'About Sahu Marts', href: '/about' },
  { label: 'Privacy policy', href: '/privacy-policy' },
  { label: 'Terms of use', href: '/terms' },
  { label: 'Shipping policy', href: '/shipping-policy' },
  { label: 'Returns policy', href: '/returns-policy' },
]

function SocialIcon({ name }: { name: 'instagram' | 'facebook' | 'youtube' | 'pinterest' }) {
  const paths: Record<typeof name, React.ReactNode> = {
    instagram: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
      </>
    ),
    facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5Z" />,
    youtube: (
      <>
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
        <path d="m10 9.5 5 2.5-5 2.5Z" fill="currentColor" />
      </>
    ),
    pinterest: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M11 20l1.6-7.2M10.4 13.5c.4 1 1.3 1.5 2.3 1.5 2 0 3.3-1.8 3.3-4 0-2.3-1.8-4-4.2-4C9 7 7.6 8.9 7.6 10.7c0 .8.3 1.6.8 2" />
      </>
    ),
  }
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[name]}
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="on-dark mt-24 bg-forest text-ivory">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link to="/" aria-label="Sahu Marts home">
            <Logo tone="light" size="md" />
          </Link>
          <p className="mt-5 font-display text-2xl leading-snug text-ivory">Everything You Love. All in One Place.</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ivory/75">
            Sarees, jewellery, ethnic wear, menswear, fabrics, luggage and home essentials — chosen with care for Indian homes.
          </p>
          <ul className="mt-6 flex gap-2" aria-label="Social media (placeholder links)">
            {(['instagram', 'facebook', 'youtube', 'pinterest'] as const).map((s) => (
              <li key={s}>
                <Link
                  to="/contact#social"
                  aria-label={`${s[0].toUpperCase()}${s.slice(1)} (placeholder — see contact page)`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ivory/25 text-ivory/90 transition-colors hover:border-gold hover:text-gold"
                >
                  <SocialIcon name={s} />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer categories" className="lg:col-span-2">
          <h2 className="text-[11px] font-semibold tracking-[0.22em] text-gold uppercase">Shop</h2>
          <ul className="mt-5 space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to={`/category/${c.slug}`} className="text-ivory/80 transition-colors hover:text-ivory">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Help" className="lg:col-span-2">
          <h2 className="text-[11px] font-semibold tracking-[0.22em] text-gold uppercase">Help</h2>
          <ul className="mt-5 space-y-2.5 text-sm">
            {help.map((l) => (
              <li key={l.href}>
                <Link to={l.href} className="text-ivory/80 transition-colors hover:text-ivory">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <h2 className="mt-10 text-[11px] font-semibold tracking-[0.22em] text-gold uppercase">Company</h2>
          <ul className="mt-5 space-y-2.5 text-sm">
            {company.map((l) => (
              <li key={l.label}>
                <Link to={l.href} className="text-ivory/80 transition-colors hover:text-ivory">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <h2 className="text-[11px] font-semibold tracking-[0.22em] text-gold uppercase">The Sahu Marts letter</h2>
          <p className="mt-5 text-sm leading-relaxed text-ivory/80">
            New arrivals, styling notes and seasonal edits — once or twice a month, never more.
          </p>
          <NewsletterForm tone="dark" className="mt-5" />
          <div className="mt-8 rounded-lg border border-ivory/15 p-4 text-[13px] leading-relaxed text-ivory/75">
            <p className="font-medium text-ivory">Payments accepted (demo)</p>
            <p className="mt-1">Cash on Delivery · UPI · Cards · Net Banking. No real payments are processed on this demo website.</p>
          </div>
        </div>
      </div>
      <div className="border-t border-ivory/15">
        <div className="container-page flex flex-col gap-2 py-6 text-[12px] text-ivory/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Sahu Marts. Demo website.</p>
          <p>Prices in Indian Rupees (₹), inclusive of all taxes.</p>
        </div>
      </div>
    </footer>
  )
}
