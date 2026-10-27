import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, Heart, LogOut, MapPin, Package, User } from 'lucide-react'
import { toast } from 'sonner'
import { firstName, useAuth } from '@/store/auth'

const itemClass =
  'flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm text-charcoal outline-none data-[highlighted]:bg-sage'

export function AccountMenu() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return (
      <Link to="/login" className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-sage">
        <User className="h-5 w-5 text-forest" aria-hidden />
        <span className="leading-tight">
          <span className="block text-[11px] text-muted">Account</span>
          <span className="block text-[13px] font-medium whitespace-nowrap">Sign in</span>
        </span>
      </Link>
    )
  }

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-sage data-[state=open]:bg-sage">
        <User className="h-5 w-5 text-forest" aria-hidden />
        <span className="text-left leading-tight">
          <span className="block text-[11px] text-muted">Account</span>
          <span className="block max-w-[120px] truncate text-[13px] font-medium">Hi, {firstName(user)}</span>
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-muted" aria-hidden />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-56 rounded-lg border border-line bg-white p-1.5 shadow-lift data-[state=open]:animate-[fade-in_150ms]"
        >
          <div className="px-3 pt-2 pb-2.5">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="truncate text-[12px] text-muted">{user.email}</p>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-line" />
          <DropdownMenu.Item className={itemClass} onSelect={() => navigate('/account')}>
            <User className="h-4 w-4" aria-hidden /> My account
          </DropdownMenu.Item>
          <DropdownMenu.Item className={itemClass} onSelect={() => navigate('/account/orders')}>
            <Package className="h-4 w-4" aria-hidden /> Orders
          </DropdownMenu.Item>
          <DropdownMenu.Item className={itemClass} onSelect={() => navigate('/account/addresses')}>
            <MapPin className="h-4 w-4" aria-hidden /> Addresses
          </DropdownMenu.Item>
          <DropdownMenu.Item className={itemClass} onSelect={() => navigate('/wishlist')}>
            <Heart className="h-4 w-4" aria-hidden /> Wishlist
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-line" />
          <DropdownMenu.Item
            className={itemClass}
            onSelect={() => {
              signOut()
              toast('You have been signed out.')
              navigate('/')
            }}
          >
            <LogOut className="h-4 w-4" aria-hidden /> Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
