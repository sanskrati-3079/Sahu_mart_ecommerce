import { Link } from 'react-router-dom'
import { PolicyLayout } from '@/components/PolicyLayout'
import { usePageTitle } from '@/components/PageMeta'
import { formatINR } from '@/lib/format'
import { EXPRESS_SHIPPING_FEE, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from '@/lib/pricing'

export default function ShippingPolicy() {
  usePageTitle('Shipping policy')
  return (
    <PolicyLayout
      title="Shipping policy"
      intro="We want you to know exactly when your order will arrive and what it will cost to get there — before you pay."
    >
      <h2>Delivery charges</h2>
      <ul>
        <li>
          <strong>Standard delivery:</strong> free on orders of {formatINR(FREE_SHIPPING_THRESHOLD)} and above;{' '}
          {formatINR(STANDARD_SHIPPING_FEE)} on smaller orders.
        </li>
        <li>
          <strong>Express delivery:</strong> {formatINR(EXPRESS_SHIPPING_FEE)} on any order, with priority packing and dispatch.
        </li>
        <li>The FREESHIP coupon waives the standard delivery charge on any order.</li>
      </ul>

      <h2>Delivery times</h2>
      <p>Delivery estimates depend on your pincode. You can check yours on any product page or set it from the header.</p>
      <ul>
        <li>Metro cities: standard delivery in 2–4 days, express in 1–2 days.</li>
        <li>Other locations: standard delivery in 4–7 days, express in 2–3 days.</li>
      </ul>
      <p>
        Estimated dates are shown at checkout and on your order confirmation. Festivals, weather and remote locations can occasionally add a
        day or two.
      </p>

      <h2>Order processing</h2>
      <p>
        Orders are confirmed within minutes and usually packed the same day. Fabrics sold by the metre are cut to your chosen length after
        confirmation, which can add up to one working day.
      </p>

      <h2>Tracking your order</h2>
      <p>
        Every order gets an order number (for example SM-DEMO-48213). Use it on the <Link to="/track-order">order tracking page</Link> to
        see each stage, from placed to delivered. If you are signed in, your orders also appear under{' '}
        <Link to="/account/orders">My orders</Link>.
      </p>

      <h2>Cash on Delivery</h2>
      <p>
        Cash on Delivery is available across serviceable pincodes. Please keep the exact amount ready, or pay the delivery partner by UPI
        where supported.
      </p>

      <h2>Damaged or missing items</h2>
      <p>
        If a parcel arrives damaged or tampered with, please photograph it and contact us within 48 hours at [Support email]. We will
        arrange a replacement or refund as described in our <Link to="/returns-policy">returns policy</Link>.
      </p>
    </PolicyLayout>
  )
}
