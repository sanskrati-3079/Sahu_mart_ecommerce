import { Link } from 'react-router-dom'
import { Monogram } from '@/components/brand/Logo'
import { Button } from '@/components/ui/button'
import { usePageTitle } from '@/components/PageMeta'
import { categories } from '@/data/categories'
import { editorial } from '@/data/images'

export default function NotFound({ title = 'This page has wandered off', message }: { title?: string; message?: string }) {
  usePageTitle('Page not found')
  return (
    <section className="container-page grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-24">
      <div>
        <Monogram className="h-12 w-12" />
        <p className="eyebrow mt-8">Error 404</p>
        <h1 className="display mt-3 text-4xl sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
          {message ?? 'The page you were looking for has moved, or perhaps never existed. Let’s get you back to something lovely.'}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/">Back to home</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to="/shop">Browse all products</Link>
          </Button>
        </div>
        <p className="mt-10 text-sm font-medium">Popular categories</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {categories.slice(0, 6).map((c) => (
            <li key={c.slug}>
              <Link
                to={`/category/${c.slug}`}
                className="inline-block rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] hover:border-forest hover:text-forest"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="overflow-hidden rounded-lg">
        <img src={editorial.notFound} alt="A stack of colourful vintage suitcases" className="aspect-[4/3] w-full object-cover" />
      </div>
    </section>
  )
}
