import { NavLink } from 'react-router-dom'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { DemoNote } from '@/components/ui/demo-note'
import { cn } from '@/lib/utils'

const policies = [
  { to: '/shipping-policy', label: 'Shipping policy' },
  { to: '/returns-policy', label: 'Returns & exchanges' },
  { to: '/privacy-policy', label: 'Privacy policy' },
  { to: '/terms', label: 'Terms of use' },
]

export function PolicyLayout({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <div className="container-page pt-6">
      <Breadcrumbs items={[{ label: title }]} />
      <div className="mt-6 grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-16">
        <nav aria-label="Policies" className="order-2 lg:order-1">
          <p className="eyebrow mb-4">Policies</p>
          <ul className="space-y-1">
            {policies.map((p) => (
              <li key={p.to}>
                <NavLink
                  to={p.to}
                  className={({ isActive }) =>
                    cn('block rounded-md px-3 py-2 text-[14px]', isActive ? 'bg-forest text-ivory' : 'text-charcoal hover:bg-sage')
                  }
                >
                  {p.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink to="/contact" className="block rounded-md px-3 py-2 text-[14px] text-charcoal hover:bg-sage">
                Contact us
              </NavLink>
            </li>
          </ul>
        </nav>
        <article className="order-1 max-w-3xl lg:order-2">
          <h1 className="display text-[36px] leading-tight sm:text-[48px]">{title}</h1>
          <p className="mt-2 text-[13px] text-muted">Last updated: 1 October 2026</p>
          <p className="mt-6 text-[17px] leading-relaxed text-charcoal/85">{intro}</p>
          <DemoNote className="mt-6">
            Sahu Marts is a demo website. This policy is sample content written to show how the store would work; contact details in square
            brackets are placeholders.
          </DemoNote>
          <div className="prose-policy mt-4">{children}</div>
        </article>
      </div>
    </div>
  )
}
