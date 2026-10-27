import { Link } from 'react-router-dom'
import { PolicyLayout } from '@/components/PolicyLayout'
import { usePageTitle } from '@/components/PageMeta'

export default function ReturnsPolicy() {
  usePageTitle('Returns & exchanges')
  return (
    <PolicyLayout
      title="Returns & exchanges"
      intro="If something isn’t right, we’ll make it easy. Most items can be returned or exchanged within 7 days of delivery."
    >
      <h2>What can be returned</h2>
      <ul>
        <li>Unused items in their original condition, with all tags and packaging, within 7 days of delivery.</li>
        <li>Sarees with the blouse piece uncut and the fall and pico not yet attached.</li>
        <li>Luggage that has not been used for travel, with the lock and protective covers intact.</li>
      </ul>

      <h2>What cannot be returned</h2>
      <ul>
        <li>Fabrics cut to length (sold per metre), unless they arrive damaged or incorrect.</li>
        <li>Earrings and nose pins, for hygiene reasons.</li>
        <li>Altered, washed or used items, and scented candles that have been lit.</li>
      </ul>

      <h2>How to start a return</h2>
      <ol className="mb-4 list-decimal space-y-1.5 pl-5">
        <li>Email [Support email] with your order number and the item you’d like to return.</li>
        <li>We’ll confirm within one working day and schedule a free pickup from your delivery address.</li>
        <li>Pack the item securely with its tags. Our delivery partner will collect it.</li>
      </ol>

      <h2>Refunds</h2>
      <p>
        Once the item reaches us and passes a quick quality check, we start your refund within 2 working days. Prepaid orders are refunded
        to the original payment method; Cash on Delivery orders are refunded by bank transfer or UPI.
      </p>

      <h2>Exchanges</h2>
      <p>
        Need a different size or colour? Ask for an exchange when you contact us. If the new option is in stock, we’ll send it as soon as
        the original is picked up. Size guides are available on every clothing product page.
      </p>

      <h2>Damaged or incorrect items</h2>
      <p>
        If you receive something damaged or different from what you ordered, please contact us within 48 hours with photos. We will replace
        it or refund it in full, including any delivery charges. See our <Link to="/shipping-policy">shipping policy</Link> for more.
      </p>
    </PolicyLayout>
  )
}
