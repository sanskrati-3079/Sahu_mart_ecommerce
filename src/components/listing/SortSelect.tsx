import { useId } from 'react'
import { SORT_OPTIONS, type SortKey } from '@/lib/filters'

export function SortSelect({
  value,
  onChange,
  relevanceLabel,
}: {
  value: SortKey
  onChange: (v: SortKey) => void
  relevanceLabel?: string
}) {
  const id = useId()
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="hidden text-[13px] text-muted sm:block">
        Sort by
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="h-10 rounded-md border border-line bg-white bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%23242424%22%20stroke-width=%222%22%3E%3Cpath%20d=%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-[length:14px] bg-[right_10px_center] bg-no-repeat pr-8 pl-3 text-[13px] font-medium text-charcoal appearance-none focus:border-forest focus:outline-none"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.value === 'recommended' && relevanceLabel ? relevanceLabel : o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
