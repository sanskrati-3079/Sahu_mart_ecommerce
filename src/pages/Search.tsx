import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import { ListingLayout } from '@/components/listing/ListingLayout'
import { usePageTitle } from '@/components/PageMeta'
import { categories } from '@/data/categories'
import { formatINR } from '@/lib/format'
import { POPULAR_SEARCHES, searchProducts, suggestCorrection } from '@/lib/search'

export default function Search() {
  const [sp] = useSearchParams()
  const q = (sp.get('q') ?? '').trim()
  usePageTitle(q ? `Search: ${q}` : 'Search')

  const { parsed, base, relevance } = useMemo(() => {
    const { parsed, results } = searchProducts(q)
    return { parsed, base: results.map((r) => r.product), relevance: new Map(results.map((r) => [r.product.id, r.score])) }
  }, [q])
  const suggestion = useMemo(() => (q && base.length === 0 ? suggestCorrection(q) : null), [q, base.length])

  const understood: string[] = []
  if (parsed.min !== undefined && parsed.max !== undefined) understood.push(`Price ${formatINR(parsed.min)} – ${formatINR(parsed.max)}`)
  else if (parsed.max !== undefined) understood.push(`Price up to ${formatINR(parsed.max)}`)
  else if (parsed.min !== undefined) understood.push(`Price from ${formatINR(parsed.min)}`)
  if (parsed.colors.length) understood.push(`Colour: ${parsed.colors.join(' / ')}`)

  const empty = (
    <div className="mt-6 rounded-lg border border-line bg-white px-6 py-14 text-center">
      <SearchX className="mx-auto h-10 w-10 text-forest" aria-hidden />
      <p className="display mt-4 text-2xl">{q ? <>No results for “{q}”</> : 'What are you looking for?'}</p>
      {suggestion ? (
        <p className="mt-3 text-[15px]">
          Did you mean{' '}
          <Link to={`/search?q=${encodeURIComponent(suggestion)}`} className="font-medium text-forest underline underline-offset-4">
            {suggestion}
          </Link>
          ?
        </p>
      ) : (
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">Check the spelling, try a more general word, or explore one of these:</p>
      )}
      <p className="mt-8 text-[12px] font-semibold tracking-[0.16em] text-muted uppercase">Popular searches</p>
      <ul className="mt-3 flex flex-wrap justify-center gap-2">
        {POPULAR_SEARCHES.map((s) => (
          <li key={s}>
            <Link
              to={`/search?q=${encodeURIComponent(s)}`}
              className="inline-block rounded-full border border-line px-3.5 py-1.5 text-[13px] hover:border-forest hover:text-forest"
            >
              {s}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-[12px] font-semibold tracking-[0.16em] text-muted uppercase">Popular categories</p>
      <ul className="mt-3 flex flex-wrap justify-center gap-2">
        {categories.slice(0, 8).map((c) => (
          <li key={c.slug}>
            <Link
              to={`/category/${c.slug}`}
              className="inline-block rounded-full bg-sage px-3.5 py-1.5 text-[13px] text-forest hover:bg-forest hover:text-ivory"
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <ListingLayout
      key={q}
      title={q ? `Results for “${q}”` : 'Search'}
      crumbs={[{ label: 'Search' }]}
      base={base}
      relevance={relevance}
      intro={
        understood.length > 0 && base.length > 0 ? (
          <p className="mt-3 text-[13px] text-muted">
            We understood:{' '}
            {understood.map((u) => (
              <span key={u} className="mr-2 inline-block rounded-sm bg-sage px-2 py-0.5 text-forest">
                {u}
              </span>
            ))}
          </p>
        ) : null
      }
      emptyState={base.length === 0 ? empty : undefined}
    />
  )
}
