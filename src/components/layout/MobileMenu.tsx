import { Link } from 'react-router-dom'
import { Heart, LogOut, MapPin, Package, Truck, User } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { specialLinks } from '@/data/categories'
import { firstName, useAuth } from '@/store/auth'
import { menuCategories, subcategoryHref } from './nav-data'

interface MobileMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  const { user, signOut } = useAuth()
  const close = () => onOpenChange(false)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left">
        <div className="flex h-16 shrink-0 items-center border-b border-line px-5">
          <Link to="/" onClick={close} aria-label="Sahu Marts home">
            <Logo size="sm" />
          </Link>
        </div>
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <SheetDescription className="sr-only">Browse categories and account links</SheetDescription>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="border-b border-line px-5 py-4">
            {user ? (
              <p className="text-sm">
                Hi, <span className="font-medium">{firstName(user)}</span>
              </p>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  onClick={close}
                  className="flex-1 rounded-md bg-forest px-4 py-2.5 text-center text-sm font-medium text-ivory"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  onClick={close}
                  className="flex-1 rounded-md border border-forest px-4 py-2.5 text-center text-sm font-medium text-forest"
                >
                  Create account
                </Link>
              </div>
            )}
          </div>

          <nav aria-label="Mobile categories" className="px-5">
            <ul className="flex gap-2 py-4">
              {specialLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    to={l.href}
                    onClick={close}
                    className="inline-block rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-medium text-forest"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Accordion type="single" collapsible>
              {menuCategories.map((c) => (
                <AccordionItem key={c.slug} value={c.slug}>
                  <AccordionTrigger className="py-3.5">{c.name}</AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <ul className="space-y-1 border-l border-line pl-4">
                      <li>
                        <Link to={`/category/${c.slug}`} onClick={close} className="block py-1.5 text-[14px] font-medium text-forest">
                          View all {c.name}
                        </Link>
                      </li>
                      {c.subcategories.map((s) => (
                        <li key={s}>
                          <Link to={subcategoryHref(c.slug, s)} onClick={close} className="block py-1.5 text-[14px] text-charcoal">
                            {s}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </nav>

          <ul className="space-y-1 px-5 py-5 text-[14px]">
            {user && (
              <li>
                <Link to="/account" onClick={close} className="flex items-center gap-3 py-2">
                  <User className="h-4 w-4 text-forest" aria-hidden /> My account
                </Link>
              </li>
            )}
            <li>
              <Link to={user ? '/account/orders' : '/track-order'} onClick={close} className="flex items-center gap-3 py-2">
                <Package className="h-4 w-4 text-forest" aria-hidden /> {user ? 'My orders' : 'Track order'}
              </Link>
            </li>
            {user && (
              <li>
                <Link to="/account/addresses" onClick={close} className="flex items-center gap-3 py-2">
                  <MapPin className="h-4 w-4 text-forest" aria-hidden /> Addresses
                </Link>
              </li>
            )}
            <li>
              <Link to="/wishlist" onClick={close} className="flex items-center gap-3 py-2">
                <Heart className="h-4 w-4 text-forest" aria-hidden /> Wishlist
              </Link>
            </li>
            <li>
              <Link to="/shipping-policy" onClick={close} className="flex items-center gap-3 py-2">
                <Truck className="h-4 w-4 text-forest" aria-hidden /> Shipping & delivery
              </Link>
            </li>
            {user && (
              <li>
                <button
                  type="button"
                  onClick={() => {
                    signOut()
                    close()
                  }}
                  className="flex items-center gap-3 py-2"
                >
                  <LogOut className="h-4 w-4 text-forest" aria-hidden /> Sign out
                </button>
              </li>
            )}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  )
}
