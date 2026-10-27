import { CreditCard, Headphones, PackageSearch, RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import { StaggerGrid, StaggerItem } from '@/components/motion'
import { SectionHeading } from '@/components/SectionHeading'

const points = [
  { icon: ShieldCheck, title: 'Secure checkout', text: 'Your details are protected at every step of checkout.' },
  { icon: Truck, title: 'Clear delivery estimates', text: 'Enter your pincode to see an estimated delivery window up front.' },
  { icon: RotateCcw, title: 'Easy returns', text: '7-day returns on most items, with simple pickup and refunds.' },
  { icon: CreditCard, title: 'Multiple payment options', text: 'Cash on Delivery, UPI, cards and net banking.' },
  { icon: Headphones, title: 'Customer support', text: 'Friendly help by email and phone, seven days a week.' },
  { icon: PackageSearch, title: 'Order tracking', text: 'Follow your order from packed to doorstep with one number.' },
]

export function WhyShop() {
  return (
    <section aria-labelledby="why-title" className="border-y border-line py-16 lg:py-20">
      <div className="container-page">
        <SectionHeading eyebrow="Why shop with us" title="Shopping that feels easy" id="why-title" align="center" />
        <StaggerGrid className="grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-6">
          {points.map(({ icon: Icon, title, text }) => (
            <StaggerItem key={title} className="text-center">
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-sage text-forest">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 text-[14px] font-semibold">{title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{text}</p>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  )
}
