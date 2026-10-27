import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { RequireAuth } from '@/components/layout/RequireAuth'

const Home = lazy(() => import('@/pages/Home'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const Shop = lazy(() => import('@/pages/Shop'))
const Category = lazy(() => import('@/pages/Category'))
const Search = lazy(() => import('@/pages/Search'))
const ProductDetail = lazy(() => import('@/pages/ProductDetail'))
const Cart = lazy(() => import('@/pages/Cart'))
const Wishlist = lazy(() => import('@/pages/Wishlist'))
const Login = lazy(() => import('@/pages/Login'))
const Signup = lazy(() => import('@/pages/Signup'))
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'))
const Account = lazy(() => import('@/pages/account/Account'))
const Addresses = lazy(() => import('@/pages/account/Addresses'))
const Orders = lazy(() => import('@/pages/account/Orders'))
const Checkout = lazy(() => import('@/pages/Checkout'))
const OrderConfirmation = lazy(() => import('@/pages/OrderConfirmation'))
const TrackOrder = lazy(() => import('@/pages/TrackOrder'))
const About = lazy(() => import('@/pages/About'))
const Contact = lazy(() => import('@/pages/Contact'))
const PrivacyPolicy = lazy(() => import('@/pages/policies/PrivacyPolicy'))
const Terms = lazy(() => import('@/pages/policies/Terms'))
const ShippingPolicy = lazy(() => import('@/pages/policies/ShippingPolicy'))
const ReturnsPolicy = lazy(() => import('@/pages/policies/ReturnsPolicy'))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="category/:slug" element={<Category />} />
          <Route path="search" element={<Search />} />
          <Route path="product/:slug" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-confirmation/:id" element={<OrderConfirmation />} />
          <Route path="track-order" element={<TrackOrder />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route element={<RequireAuth />}>
            <Route path="account" element={<Account />} />
            <Route path="account/addresses" element={<Addresses />} />
            <Route path="account/orders" element={<Orders />} />
          </Route>
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="shipping-policy" element={<ShippingPolicy />} />
          <Route path="returns-policy" element={<ReturnsPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
