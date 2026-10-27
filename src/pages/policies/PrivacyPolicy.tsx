import { Link } from 'react-router-dom'
import { PolicyLayout } from '@/components/PolicyLayout'
import { usePageTitle } from '@/components/PageMeta'

export default function PrivacyPolicy() {
  usePageTitle('Privacy policy')
  return (
    <PolicyLayout
      title="Privacy policy"
      intro="Your trust matters. This page explains what information the Sahu Marts demo keeps, where it lives and how you can remove it."
    >
      <h2>How this demo stores data</h2>
      <p>
        This demo has no server or database. Everything you enter — your name, email, phone number, addresses, bag, wishlist and demo orders
        — is saved only in your own browser’s local storage. It is never sent to Sahu Marts or anyone else.
      </p>
      <ul>
        <li>
          <strong>Passwords are never stored.</strong> They are checked for format on the sign-in and sign-up forms and then discarded.
        </li>
        <li>No payment details are ever requested or saved. All payment options are simulations.</li>
        <li>Newsletter and contact forms show a confirmation but do not send anything.</li>
      </ul>

      <h2>What a live store would collect</h2>
      <p>For a real store, we would collect only what is needed to fulfil your orders and support you:</p>
      <ul>
        <li>Contact details (name, email, mobile number) to confirm orders and send updates.</li>
        <li>Delivery addresses to ship your orders.</li>
        <li>Order history to handle returns, exchanges and support requests.</li>
      </ul>
      <p>
        We would never sell your personal information, and we would share it only with delivery and payment partners as needed to complete
        your order.
      </p>

      <h2>Cookies and local storage</h2>
      <p>
        The demo uses your browser’s local storage to remember your bag, wishlist, recent searches, recently viewed products, delivery
        pincode and demo account. It does not use advertising or tracking cookies.
      </p>

      <h2>Removing your data</h2>
      <p>
        You can sign out from <Link to="/account">your account</Link> at any time. To remove everything, clear this site’s data from your
        browser settings — that deletes your demo account, addresses, bag, wishlist and orders.
      </p>

      <h2>Questions</h2>
      <p>
        If you have questions about privacy, contact us at [Privacy contact email] or visit our <Link to="/contact">contact page</Link>.
      </p>
    </PolicyLayout>
  )
}
