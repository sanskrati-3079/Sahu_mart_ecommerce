const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })

/** Formats a rupee amount the Indian way: 1499 → "₹1,499", 125000 → "₹1,25,000". */
export function formatINR(amount: number): string {
  const rounded = Math.round(amount)
  return `${rounded < 0 ? '−' : ''}₹${inr.format(Math.abs(rounded))}`
}

/** Whole-number discount percentage from MRP to selling price. 0 when there is no discount. */
export function discountPercent(price: number, mrp: number): number {
  if (!mrp || mrp <= price) return 0
  return Math.round(((mrp - price) / mrp) * 100)
}

const dateFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
const shortDateFmt = new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })

export function formatDate(iso: string | Date): string {
  return dateFmt.format(typeof iso === 'string' ? new Date(iso) : iso)
}

export function formatShortDate(iso: string | Date): string {
  return shortDateFmt.format(typeof iso === 'string' ? new Date(iso) : iso)
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`
}
