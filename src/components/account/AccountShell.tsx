import { NavLink, useNavigate } from 'react-router-dom'
import { Heart, LogOut, MapPin, Package, User } from 'lucide-react'
import { toast } from 'sonner'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { cn } from '@/lib/utils'
import { useAuth } from '@/store/auth'

const links = [
  { to: '/account', label: 'Profile', icon: User, end: true },
  { to: '/account/orders', label: 'Orders', icon: Package },
  { to: '/account/addresses', label: 'Addresses', icon: MapPin },
  { to: '/wishlist', label: 'Wishlist', icon: Heart },
]

export function AccountShell({ title, crumb, children }: { title: string; crumb?: string; children: React.ReactNode }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  return (
    <div className="container-page pt-6">
      <Breadcrumbs items={[{ label: 'Account', href: '/account' }, ...(crumb ? [{ label: crumb }] : [])]} />
      <div className="mt-6 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside>
          <p className="text-[13px] text-muted">Signed in as</p>
          <p className="mt-0.5 font-medium">{user?.name}</p>
          <p className="truncate text-[13px] text-muted">{user?.email}</p>
          <nav aria-label="Account" className="mt-6">
            <ul className="scrollbar-none flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
              {links.map(({ to, label, icon: Icon, end }) => (
                <li key={to} className="shrink-0">
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 rounded-md px-3 py-2.5 text-[14px] transition-colors',
                        isActive ? 'bg-forest text-ivory' : 'bg-white text-charcoal hover:bg-sage lg:bg-transparent',
                      )
                    }
                  >
                    <Icon className="h-4 w-4" aria-hidden /> {label}
                  </NavLink>
                </li>
              ))}
              <li className="shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    signOut()
                    toast('You have been signed out.')
                    navigate('/')
                  }}
                  className="flex w-full items-center gap-2.5 rounded-md bg-white px-3 py-2.5 text-[14px] text-charcoal hover:bg-sage lg:bg-transparent"
                >
                  <LogOut className="h-4 w-4" aria-hidden /> Sign out
                </button>
              </li>
            </ul>
          </nav>
        </aside>
        <section>
          <h1 className="display text-[36px] leading-tight sm:text-[40px]">{title}</h1>
          <div className="mt-8">{children}</div>
        </section>
      </div>
    </div>
  )
}
