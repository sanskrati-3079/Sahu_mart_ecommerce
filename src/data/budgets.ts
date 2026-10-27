import type { BudgetRange } from '@/types'

export const budgets: BudgetRange[] = [
  { id: 'under-499', label: 'Under ₹499', shortLabel: '₹499', min: 0, max: 499 },
  { id: '500-999', label: '₹500 – ₹999', shortLabel: '₹999', min: 500, max: 999 },
  { id: '1000-1999', label: '₹1,000 – ₹1,999', shortLabel: '₹1,999', min: 1000, max: 1999 },
  { id: '2000-4999', label: '₹2,000 – ₹4,999', shortLabel: '₹4,999', min: 2000, max: 4999 },
  { id: '5000-plus', label: '₹5,000 & above', shortLabel: '₹5,000+', min: 5000, max: null },
]
