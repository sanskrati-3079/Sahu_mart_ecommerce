import { categories } from '@/data/categories'
import { products } from '@/data/products'
import type { Category, Product } from '@/types'

const STOPWORDS = new Set([
  'a',
  'an',
  'the',
  'for',
  'with',
  'and',
  'in',
  'of',
  'on',
  'to',
  'me',
  'show',
  'buy',
  'rs',
  'inr',
  'price',
  'priced',
  'cost',
  'costing',
  'than',
  'less',
  'more',
  'item',
  'items',
])

/** Colour words people type → palette colour names. */
const COLOR_WORDS: Record<string, string[]> = {
  black: ['Black'],
  white: ['White', 'Ivory'],
  ivory: ['Ivory'],
  cream: ['Ivory', 'Beige'],
  offwhite: ['Ivory'],
  red: ['Red', 'Maroon'],
  maroon: ['Maroon'],
  pink: ['Pink', 'Rani Pink'],
  peach: ['Peach'],
  orange: ['Orange', 'Rust'],
  rust: ['Rust'],
  yellow: ['Yellow', 'Mustard'],
  mustard: ['Mustard'],
  gold: ['Gold-tone'],
  golden: ['Gold-tone'],
  green: ['Green', 'Bottle Green', 'Mint', 'Olive', 'Sage'],
  mint: ['Mint'],
  olive: ['Olive'],
  sage: ['Sage'],
  teal: ['Teal'],
  blue: ['Royal Blue', 'Navy', 'Sky Blue'],
  navy: ['Navy'],
  indigo: ['Navy'],
  purple: ['Purple', 'Lavender'],
  lavender: ['Lavender'],
  beige: ['Beige', 'Khaki'],
  khaki: ['Khaki'],
  tan: ['Tan'],
  brown: ['Brown', 'Tan'],
  grey: ['Grey', 'Charcoal'],
  gray: ['Grey', 'Charcoal'],
  charcoal: ['Charcoal'],
  silver: ['Silver-tone', 'Oxidised Silver'],
  multicolour: ['Multicolour'],
  multicolor: ['Multicolour'],
}

const SYNONYMS: Record<string, string[]> = {
  sari: ['saree'],
  saris: ['saree'],
  jhumki: ['jhumka'],
  jhumkis: ['jhumka'],
  pant: ['trouser', 'pants'],
  pants: ['trouser', 'pants'],
  suitcase: ['trolley', 'suitcase'],
  luggage: ['trolley', 'luggage'],
  bag: ['bag', 'tote', 'duffel', 'trolley'],
  bags: ['bag', 'tote', 'duffel', 'trolley'],
  cloth: ['fabric'],
  material: ['fabric'],
  fabrics: ['fabric'],
  shirting: ['shirting'],
  suiting: ['suiting'],
  bedsheet: ['bedsheet', 'bed'],
  bedsheets: ['bedsheet', 'bed'],
  necklace: ['necklace', 'choker', 'pendant'],
  earring: ['earrings', 'jhumka'],
  earrings: ['earrings', 'jhumka'],
  mens: ['men'],
  womens: ['women'],
  ladies: ['women'],
  gents: ['men'],
}

export interface ParsedQuery {
  raw: string
  text: string
  tokens: string[]
  min?: number
  max?: number
  colors: string[]
}

function toNumber(s: string): number {
  const clean = s.replace(/,/g, '')
  const k = clean.endsWith('k')
  return Math.round(parseFloat(k ? clean.slice(0, -1) : clean) * (k ? 1000 : 1))
}

const NUM = '(\\d[\\d,]*(?:\\.\\d+)?k?)'

export function parseQuery(raw: string): ParsedQuery {
  let text = ` ${raw.toLowerCase().replace(/₹|\brs\.?(?=[\s\d]|$)|\binr\b|\brupees?\b|\/-/g, ' ')} `
  let min: number | undefined
  let max: number | undefined

  const between = new RegExp(`(?:between|from)\\s+${NUM}\\s*(?:and|to|-|–)\\s*${NUM}`)
  const range = new RegExp(`${NUM}\\s*(?:-|–|to)\\s*${NUM}`)
  const under = new RegExp(`(?:under|below|less than|upto|up to|within|max|maximum|<=?|cheaper than)\\s*${NUM}`)
  const over = new RegExp(`(?:above|over|more than|greater than|min|minimum|>=?|starting|from)\\s*${NUM}`)

  let m = text.match(between) ?? text.match(range)
  if (m) {
    min = Math.min(toNumber(m[1]), toNumber(m[2]))
    max = Math.max(toNumber(m[1]), toNumber(m[2]))
    text = text.replace(m[0], ' ')
  }
  m = text.match(under)
  if (m) {
    max = toNumber(m[1])
    text = text.replace(m[0], ' ')
  }
  m = text.match(over)
  if (m) {
    min = toNumber(m[1])
    text = text.replace(m[0], ' ')
  }

  const words = text.split(/[^a-z0-9]+/).filter((w) => w.length > 1 && !STOPWORDS.has(w) && !/^\d+$/.test(w))
  const colors = new Set<string>()
  const tokens: string[] = []
  for (const w of words) {
    if (COLOR_WORDS[w]) COLOR_WORDS[w].forEach((c) => colors.add(c))
    else if (w !== 'tone') tokens.push(w)
  }
  return { raw, text: text.trim(), tokens, min, max, colors: [...colors] }
}

const categoryNames = new Map(categories.map((c) => [c.slug, c.name]))

function words(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[’']/g, '')
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
}

interface Indexed {
  product: Product
  fields: { weight: number; words: string[] }[]
}

const index: Indexed[] = products.map((p) => ({
  product: p,
  fields: [
    { weight: 6, words: words(p.name) },
    { weight: 4, words: words(`${p.subcategory} ${p.tags.join(' ')}`) },
    { weight: 3, words: words(p.categories.map((c) => categoryNames.get(c) ?? '').join(' ')) },
    { weight: 2, words: words(`${p.brand} ${p.material} ${p.colors.map((c) => c.name).join(' ')} ${p.occasion.join(' ')}`) },
    { weight: 1, words: words(`${p.description} ${Object.values(p.attributes).join(' ')}`) },
  ],
}))

function singular(w: string): string {
  if (w.endsWith('ies') && w.length > 4) return `${w.slice(0, -3)}y`
  if (w.endsWith('es') && w.length > 4 && /(ss|sh|ch|x)es$/.test(w)) return w.slice(0, -2)
  if (w.endsWith('s') && w.length > 3 && !w.endsWith('ss')) return w.slice(0, -1)
  return w
}

function variants(token: string): string[] {
  const base = [token, singular(token)]
  return [...new Set([...base, ...(SYNONYMS[token] ?? [])])]
}

function tokenScore(entry: Indexed, token: string): number {
  const alts = variants(token)
  let best = 0
  for (const f of entry.fields) {
    if (f.weight <= best) continue
    for (const w of f.words) {
      if (alts.some((a) => w === a || singular(w) === a)) {
        best = f.weight
        break
      }
      if (alts.some((a) => a.length >= 3 && w.startsWith(a))) best = Math.max(best, f.weight / 2)
    }
  }
  return best
}

export interface SearchResult {
  product: Product
  score: number
}

function runSearch(parsed: ParsedQuery, minTokenScore: number): SearchResult[] {
  const results: SearchResult[] = []
  const hasCriteria = parsed.tokens.length || parsed.colors.length || parsed.min !== undefined || parsed.max !== undefined
  if (!hasCriteria) return results
  for (const entry of index) {
    const p = entry.product
    if (parsed.min !== undefined && p.price < parsed.min) continue
    if (parsed.max !== undefined && p.price > parsed.max) continue
    if (parsed.colors.length && !p.colors.some((c) => parsed.colors.includes(c.name))) continue
    let score = parsed.colors.length ? 2 : 0
    let ok = true
    for (const t of parsed.tokens) {
      const s = tokenScore(entry, t)
      if (s < minTokenScore) {
        ok = false
        break
      }
      score += s
    }
    if (ok) results.push({ product: p, score: score + p.rating / 10 })
  }
  return results.sort((a, b) => b.score - a.score || b.product.reviewCount - a.product.reviewCount)
}

/**
 * Searches name, brand, category, subcategory, tags, colours, material and description.
 * Every word must match a meaningful field; description-only matches are used as a fallback.
 */
export function searchProducts(raw: string): { parsed: ParsedQuery; results: SearchResult[] } {
  const parsed = parseQuery(raw)
  let results = runSearch(parsed, 2)
  if (!results.length) results = runSearch(parsed, 0.5)
  return { parsed, results }
}

export function matchCategories(raw: string, limit = 3): Category[] {
  const { tokens } = parseQuery(raw)
  if (!tokens.length) return []
  return categories
    .filter((c) => {
      const w = words(`${c.name} ${c.subcategories.join(' ')}`)
      return tokens.some((t) => variants(t).some((a) => a.length >= 3 && w.some((x) => x.startsWith(a) || singular(x) === a)))
    })
    .slice(0, limit)
}

// ── "Did you mean…?" ────────────────────────────────────────────────────────
const vocabulary = [
  ...new Set(index.flatMap((e) => e.fields.slice(0, 4).flatMap((f) => f.words)).filter((w) => w.length > 3 && !/\d/.test(w))),
]

function distance(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
  return dp[a.length][b.length]
}

export function suggestCorrection(raw: string): string | null {
  const { tokens } = parseQuery(raw)
  let changed = false
  let out = raw.toLowerCase()
  for (const t of tokens) {
    if (vocabulary.includes(t) || vocabulary.includes(singular(t))) continue
    let best: string | null = null
    let bestD = t.length > 6 ? 3 : 2
    for (const v of vocabulary) {
      if (Math.abs(v.length - t.length) > 2) continue
      const d = distance(t, v)
      if (d < bestD) {
        bestD = d
        best = v
      }
    }
    if (best) {
      out = out.replace(t, best)
      changed = true
    }
  }
  return changed && searchProducts(out).results.length ? out : null
}

export const POPULAR_SEARCHES = [
  'Banarasi saree under 2000',
  'Oxidised jhumka',
  'Cabin trolley bag',
  'Black formal trousers',
  'Cotton shirting fabric',
  'Gold-tone earrings',
]
