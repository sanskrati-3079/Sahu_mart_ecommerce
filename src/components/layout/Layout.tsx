import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { Toaster } from 'sonner'
import { PageLoader } from '@/components/brand/LoadingMark'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { AnnouncementBar } from './AnnouncementBar'
import { Footer } from './Footer'
import { Header } from './Header'
import { ScrollToTop } from './ScrollToTop'

export function Layout() {
  return (
    <MotionConfig reducedMotion="user">
      <ScrollToTop />
      <AnnouncementBar />
      <Header />
      <main id="main" tabIndex={-1} className="min-h-[60vh] focus:outline-none">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
      <Toaster
        position="top-center"
        offset={16}
        mobileOffset={12}
        toastOptions={{
          classNames: {
            toast: '!rounded-lg !border !border-line !bg-white !text-charcoal !shadow-lift !font-sans',
            title: '!text-[14px] !font-medium',
            description: '!text-[13px] !text-muted',
            actionButton: '!bg-forest !text-ivory !rounded-md !px-3 !h-8 !text-[13px]',
          },
        }}
      />
    </MotionConfig>
  )
}
