import { useState } from 'react'
import { MapPin, Truck } from 'lucide-react'
import { estimateDelivery, isValidPincode } from '@/lib/delivery'
import { usePreferences } from '@/store/preferences'

export function PincodeChecker() {
  const { pincode, setPincode } = usePreferences()
  const [value, setValue] = useState(pincode)
  const [checked, setChecked] = useState(isValidPincode(pincode) ? pincode : '')
  const [error, setError] = useState('')

  const check = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidPincode(value)) {
      setError('Enter a valid 6-digit pincode.')
      setChecked('')
      return
    }
    setError('')
    setChecked(value)
    setPincode(value)
  }

  const standard = checked ? estimateDelivery(checked, 'standard') : null
  const express = checked ? estimateDelivery(checked, 'express') : null

  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <p className="flex items-center gap-2 text-[14px] font-medium">
        <MapPin className="h-4 w-4 text-forest" aria-hidden /> Check delivery
      </p>
      <form onSubmit={check} className="mt-3 flex gap-2" noValidate>
        <label htmlFor="pdp-pincode" className="sr-only">
          Pincode
        </label>
        <input
          id="pdp-pincode"
          inputMode="numeric"
          maxLength={6}
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter 6-digit pincode"
          aria-invalid={Boolean(error)}
          aria-describedby="pdp-pincode-msg"
          className="h-10 min-w-0 flex-1 rounded-md border border-line px-3 text-sm focus:border-forest focus:outline-none aria-[invalid=true]:border-sale"
        />
        <button
          type="submit"
          className="h-10 rounded-md border border-forest px-4 text-sm font-medium text-forest hover:bg-forest hover:text-ivory"
        >
          Check
        </button>
      </form>
      <div id="pdp-pincode-msg" aria-live="polite" className="mt-2 text-[13px]">
        {error && <p className="text-sale">{error}</p>}
        {standard && express && (
          <ul className="mt-1 space-y-1.5">
            <li className="flex items-start gap-2">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-forest" aria-hidden />
              <span>
                <strong>Estimated</strong> standard delivery to {checked}: <strong>{standard.label}</strong>
              </span>
            </li>
            <li className="pl-6 text-muted">Express (estimated): {express.label}</li>
          </ul>
        )}
        {!error && !standard && <p className="text-muted">Delivery dates are estimates for this demo.</p>}
      </div>
    </div>
  )
}
