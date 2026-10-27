import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FieldError, Input, Label } from '@/components/ui/input'
import { DemoNote } from '@/components/ui/demo-note'
import { estimateDelivery, isValidPincode } from '@/lib/delivery'
import { cn } from '@/lib/utils'
import { usePreferences } from '@/store/preferences'

export function PincodeDialog({ className }: { className?: string }) {
  const { pincode, setPincode } = usePreferences()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(pincode)
  const [error, setError] = useState('')

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidPincode(value)) {
      setError('Please enter a valid 6-digit Indian pincode.')
      return
    }
    setPincode(value.trim())
    setError('')
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (o) {
          setValue(pincode)
          setError('')
        }
      }}
    >
      <DialogTrigger
        className={cn('flex items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-sage', className)}
        aria-label={pincode ? `Delivering to ${pincode}. Change pincode` : 'Set delivery pincode'}
      >
        <MapPin className="h-5 w-5 shrink-0 text-forest" aria-hidden />
        <span className="leading-tight">
          <span className="block text-[11px] text-muted">{pincode ? 'Deliver to' : 'Delivery'}</span>
          <span className="block text-[13px] font-medium whitespace-nowrap text-charcoal">{pincode || 'Enter pincode'}</span>
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogTitle className="display text-2xl">Where should we deliver?</DialogTitle>
        <DialogDescription className="mt-1 text-sm text-muted">
          Enter your pincode to see estimated delivery dates across the store.
        </DialogDescription>
        <form onSubmit={save} className="mt-5" noValidate>
          <Label htmlFor="header-pincode">Pincode</Label>
          <div className="flex gap-2">
            <Input
              id="header-pincode"
              inputMode="numeric"
              maxLength={6}
              value={value}
              onChange={(e) => setValue(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 560001"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'header-pincode-error' : undefined}
              autoFocus
            />
            <Button type="submit">Apply</Button>
          </div>
          <FieldError id="header-pincode-error" message={error} />
          {isValidPincode(value) && (
            <p className="mt-3 text-sm text-charcoal">
              Estimated standard delivery: <strong>{estimateDelivery(value).label}</strong>
            </p>
          )}
        </form>
        <DemoNote className="mt-5">Delivery dates are simulated estimates for this demo.</DemoNote>
      </DialogContent>
    </Dialog>
  )
}
