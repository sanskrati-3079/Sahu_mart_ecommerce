import { Link } from 'react-router-dom'
import { PolicyLayout } from '@/components/PolicyLayout'
import { usePageTitle } from '@/components/PageMeta'

export default function Terms() {
  usePageTitle('Terms of use')
  return (
    <PolicyLayout
      title="Terms of use"
      intro="These terms explain how the Sahu Marts demo website may be used. By browsing the site you agree to them."
    >
      <h2>A demonstration website</h2>
      <p>
        Sahu Marts is a sample e-commerce website built to demonstrate design and shopping features. Products, prices, stock levels, reviews
        and delivery dates are illustrative. Orders placed here are not real: no payment is taken and nothing is shipped.
      </p>

      <h2>Products and pricing</h2>
      <ul>
        <li>All prices are shown in Indian Rupees (₹) and are inclusive of all taxes.</li>
        <li>MRP is the maximum retail price; where a lower selling price is shown, the discount is calculated from the MRP.</li>
        <li>
          Jewellery on this site is imitation (fashion) jewellery described as gold-tone, silver-tone or oxidised. It is not made of
          precious metals or stones.
        </li>
        <li>Fabrics are sold per metre. Colours may vary slightly from what you see on screen.</li>
      </ul>

      <h2>Coupons</h2>
      <p>
        Coupons apply to eligible orders that meet the minimum order value. Only one coupon can be used per order, and coupons cannot be
        exchanged for cash. Current demo coupons are WELCOME10, FESTIVE250 and FREESHIP.
      </p>

      <h2>Accounts</h2>
      <p>
        Demo accounts are stored only in your browser. You are responsible for any information you choose to enter. Please do not enter real
        payment or sensitive personal information.
      </p>

      <h2>Content</h2>
      <p>
        Product photography is sourced from Unsplash and used for demonstration. The Sahu Marts name, logo and page designs may not be
        copied without permission.
      </p>

      <h2>Related policies</h2>
      <p>
        Please also read our <Link to="/shipping-policy">shipping policy</Link>, <Link to="/returns-policy">returns policy</Link> and{' '}
        <Link to="/privacy-policy">privacy policy</Link>. For questions, contact us at [Support email].
      </p>
    </PolicyLayout>
  )
}
