import { useState } from 'react'
import { MapPin, Pencil, Plus, Star, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { AccountShell } from '@/components/account/AccountShell'
import { AddressForm } from '@/components/account/AddressForm'
import { usePageTitle } from '@/components/PageMeta'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { useAddresses } from '@/store/addresses'
import { useAuth } from '@/store/auth'
import type { Address } from '@/types'

const NO_ADDRESSES: Address[] = []

export function AddressText({ address }: { address: Omit<Address, 'id' | 'isDefault'> }) {
  return (
    <address className="text-[14px] leading-relaxed text-charcoal/85 not-italic">
      <span className="font-medium text-charcoal">{address.fullName}</span>
      <br />
      {address.line1}
      {address.line2 && <>, {address.line2}</>}
      <br />
      {address.landmark && (
        <>
          Landmark: {address.landmark}
          <br />
        </>
      )}
      {address.city}, {address.state} {address.pincode}
      <br />
      Phone: +91 {address.phone}
    </address>
  )
}

export default function Addresses() {
  usePageTitle('Addresses')
  const email = useAuth((s) => s.user?.email ?? '')
  const list = useAddresses((s) => s.byUser[email] ?? NO_ADDRESSES)
  const { add, update, remove, setDefault } = useAddresses()
  const [editing, setEditing] = useState<Address | 'new' | null>(null)
  const [deleting, setDeleting] = useState<Address | null>(null)

  return (
    <AccountShell title="Addresses" crumb="Addresses">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-[14px] text-muted">Saved addresses appear at checkout so you can order in a couple of taps.</p>
        <Button onClick={() => setEditing('new')}>
          <Plus aria-hidden /> Add new address
        </Button>
      </div>

      {list.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-line bg-white px-6 py-14 text-center">
          <MapPin className="mx-auto h-8 w-8 text-forest" aria-hidden />
          <p className="mt-4 font-medium">No saved addresses yet</p>
          <p className="mt-1 text-sm text-muted">Add your home or office address to speed up checkout.</p>
          <Button className="mt-6" variant="secondary" onClick={() => setEditing('new')}>
            Add an address
          </Button>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {list.map((a) => (
            <li key={a.id} className={`relative rounded-lg border bg-white p-5 ${a.isDefault ? 'border-forest' : 'border-line'}`}>
              {a.isDefault && (
                <span className="absolute top-4 right-4 rounded-sm bg-forest px-2 py-0.5 text-[10px] font-semibold tracking-wider text-ivory uppercase">
                  Default
                </span>
              )}
              <AddressText address={a} />
              <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                <Button size="sm" variant="outline" onClick={() => setEditing(a)}>
                  <Pencil aria-hidden /> Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => setDeleting(a)}>
                  <Trash2 aria-hidden /> Delete
                </Button>
                {!a.isDefault && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setDefault(email, a.id)
                      toast.success('Default address updated')
                    }}
                  >
                    <Star aria-hidden /> Set as default
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogTitle className="display text-2xl">{editing === 'new' ? 'Add a new address' : 'Edit address'}</DialogTitle>
          <DialogDescription className="mt-1 text-sm text-muted">All fields are required unless marked optional.</DialogDescription>
          <div className="mt-6">
            {editing && (
              <AddressForm
                defaultValues={editing === 'new' ? undefined : editing}
                submitLabel={editing === 'new' ? 'Save address' : 'Update address'}
                onCancel={() => setEditing(null)}
                onSubmit={(values) => {
                  if (editing === 'new') add(email, values)
                  else update(email, editing.id, values)
                  toast.success(editing === 'new' ? 'Address saved' : 'Address updated')
                  setEditing(null)
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleting !== null} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent className="max-w-md">
          <DialogTitle className="display text-2xl">Delete this address?</DialogTitle>
          <DialogDescription className="mt-2 text-sm text-muted">
            {deleting?.fullName}, {deleting?.city} {deleting?.pincode} will be removed from your saved addresses.
          </DialogDescription>
          <div className="mt-6 flex gap-3">
            <Button
              onClick={() => {
                if (deleting) remove(email, deleting.id)
                toast('Address deleted')
                setDeleting(null)
              }}
            >
              Delete
            </Button>
            <DialogClose asChild>
              <Button variant="ghost">Keep it</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </AccountShell>
  )
}
