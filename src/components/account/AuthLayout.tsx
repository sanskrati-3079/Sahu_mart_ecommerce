import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Logo } from '@/components/brand/Logo'
import { DemoNote } from '@/components/ui/demo-note'

interface AuthLayoutProps {
  title: string
  subtitle: string
  image: string
  imageAlt: string
  quote: string
  children: React.ReactNode
}

export function AuthLayout({ title, subtitle, image, imageAlt, quote, children }: AuthLayoutProps) {
  return (
    <div className="container-page py-8 lg:py-12">
      <div className="grid overflow-hidden rounded-lg bg-white shadow-soft lg:grid-cols-2">
        <div className="relative hidden lg:block">
          <img src={image} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-x-8 bottom-8 rounded-md bg-ivory/95 p-6">
            <Logo size="sm" />
            <p className="mt-4 font-display text-2xl leading-snug">{quote}</p>
          </div>
        </div>
        <motion.div
          className="px-6 py-10 sm:px-12 lg:px-16 lg:py-16"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Link to="/" aria-label="Sahu Marts home" className="lg:hidden">
            <Logo size="sm" />
          </Link>
          <h1 className="display mt-8 text-[36px] leading-tight lg:mt-0">{title}</h1>
          <p className="mt-2 text-[15px] text-muted">{subtitle}</p>
          <DemoNote className="mt-6">Demo mode — accounts are stored only in this browser. Passwords are never saved.</DemoNote>
          <div className="mt-8">{children}</div>
        </motion.div>
      </div>
    </div>
  )
}
