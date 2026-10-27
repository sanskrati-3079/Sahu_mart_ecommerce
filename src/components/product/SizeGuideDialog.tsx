import { Ruler } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import type { SizeGuideKind } from '@/types'

const guides: Record<SizeGuideKind, { title: string; note: string; head: string[]; rows: string[][] }> = {
  'women-ethnic': {
    title: 'Women’s kurtas & sets',
    note: 'Measurements are body measurements in inches. If you are between sizes, choose the larger size for a relaxed fit.',
    head: ['Size', 'Bust', 'Waist', 'Hip', 'Shoulder'],
    rows: [
      ['S', '34', '28', '38', '14'],
      ['M', '36', '30', '40', '14.5'],
      ['L', '38', '32', '42', '15'],
      ['XL', '40', '34', '44', '15.5'],
      ['XXL', '42', '36', '46', '16'],
    ],
  },
  'men-tops': {
    title: 'Men’s shirts & kurtas',
    note: 'Measurements are body measurements in inches. Collar sizes are approximate.',
    head: ['Size', 'Chest', 'Waist', 'Shoulder', 'Collar'],
    rows: [
      ['S', '36–38', '30–32', '17', '38 cm'],
      ['M', '38–40', '32–34', '17.5', '39 cm'],
      ['L', '40–42', '34–36', '18', '40 cm'],
      ['XL', '42–44', '36–38', '18.5', '42 cm'],
      ['XXL', '44–46', '38–40', '19', '44 cm'],
    ],
  },
  'men-trousers': {
    title: 'Men’s trousers & jeans',
    note: 'Choose your usual waist size in inches. Inseam is 32 inches on all sizes and can be altered by your tailor.',
    head: ['Waist', 'Waist (cm)', 'Hip', 'Thigh', 'Inseam'],
    rows: [
      ['30', '76', '38', '22', '32'],
      ['32', '81', '40', '23', '32'],
      ['34', '86', '42', '24', '32'],
      ['36', '91', '44', '25', '32'],
      ['38', '97', '46', '26', '32'],
    ],
  },
}

export function SizeGuideDialog({ kind }: { kind: SizeGuideKind }) {
  const g = guides[kind]
  return (
    <Dialog>
      <DialogTrigger className="inline-flex items-center gap-1.5 text-[13px] font-medium text-forest underline underline-offset-4">
        <Ruler className="h-4 w-4" aria-hidden /> Size guide
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogTitle className="display text-2xl">Size guide</DialogTitle>
        <DialogDescription className="mt-1 text-sm text-muted">{g.title}</DialogDescription>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <caption className="sr-only">{g.title} size chart</caption>
            <thead>
              <tr className="border-b border-line">
                {g.head.map((h) => (
                  <th key={h} scope="col" className="py-2.5 pr-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {g.rows.map((r) => (
                <tr key={r[0]} className="border-b border-line/70">
                  {r.map((c, i) =>
                    i === 0 ? (
                      <th key={i} scope="row" className="py-2.5 pr-3 font-medium">
                        {c}
                      </th>
                    ) : (
                      <td key={i} className="py-2.5 pr-3 text-charcoal/80">
                        {c}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[13px] leading-relaxed text-muted">{g.note}</p>
        <div className="mt-5 rounded-md bg-sage p-4 text-[13px] leading-relaxed">
          <p className="font-medium">How to measure</p>
          <p className="mt-1 text-charcoal/80">
            Chest/bust: around the fullest part. Waist: around your natural waistline. Hip: around the fullest part of the hips. Keep the
            tape snug but not tight.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
