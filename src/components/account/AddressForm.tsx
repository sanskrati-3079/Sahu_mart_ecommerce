import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { FieldError, Input, Label, Select } from '@/components/ui/input'
import { INDIAN_STATES } from '@/data/states'
import { addressSchema, type AddressFormValues } from '@/lib/validation'
import type { AddressData } from '@/lib/address'
import type { Address } from '@/types'

interface AddressFormProps {
  defaultValues?: Partial<Omit<Address, 'id'>>
  onSubmit: (values: AddressData) => void
  submitLabel?: string
  showDefaultToggle?: boolean
  onCancel?: () => void
  idPrefix?: string
}

export function AddressForm({
  defaultValues,
  onSubmit,
  submitLabel = 'Save address',
  showDefaultToggle = true,
  onCancel,
  idPrefix = 'addr',
}: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormValues, unknown, AddressData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      pincode: '',
      line1: '',
      line2: '',
      landmark: '',
      city: '',
      isDefault: false,
      ...defaultValues,
    } as Partial<AddressFormValues>,
    mode: 'onTouched',
  })

  const field = (name: keyof AddressFormValues) => ({
    id: `${idPrefix}-${name}`,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${idPrefix}-${name}-error` : undefined,
  })
  const err = (name: keyof AddressFormValues) => <FieldError id={`${idPrefix}-${name}-error`} message={errors[name]?.message} />

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Label htmlFor={`${idPrefix}-fullName`}>Full name</Label>
        <Input autoComplete="name" {...field('fullName')} {...register('fullName')} />
        {err('fullName')}
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-phone`}>Mobile number</Label>
        <div className="flex">
          <span className="inline-flex h-11 items-center rounded-l-md border border-r-0 border-line bg-sage px-3 text-[14px] text-muted">
            +91
          </span>
          <Input
            inputMode="numeric"
            maxLength={10}
            autoComplete="tel-national"
            className="rounded-l-none"
            {...field('phone')}
            {...register('phone')}
          />
        </div>
        {err('phone')}
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-pincode`}>Pincode</Label>
        <Input inputMode="numeric" maxLength={6} autoComplete="postal-code" {...field('pincode')} {...register('pincode')} />
        {err('pincode')}
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor={`${idPrefix}-line1`}>Flat / house no., building, street</Label>
        <Input autoComplete="address-line1" {...field('line1')} {...register('line1')} />
        {err('line1')}
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor={`${idPrefix}-line2`}>
          Area, locality <span className="font-normal text-muted">(optional)</span>
        </Label>
        <Input autoComplete="address-line2" {...field('line2')} {...register('line2')} />
        {err('line2')}
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor={`${idPrefix}-landmark`}>
          Landmark <span className="font-normal text-muted">(optional)</span>
        </Label>
        <Input placeholder="e.g. Near city park" {...field('landmark')} {...register('landmark')} />
        {err('landmark')}
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-city`}>City / town</Label>
        <Input autoComplete="address-level2" {...field('city')} {...register('city')} />
        {err('city')}
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-state`}>State / UT</Label>
        <Select autoComplete="address-level1" defaultValue="" {...field('state')} {...register('state')}>
          <option value="" disabled>
            Select state
          </option>
          {INDIAN_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        {err('state')}
      </div>
      {showDefaultToggle && (
        <label className="flex items-center gap-2.5 text-[14px] sm:col-span-2">
          <input type="checkbox" className="h-4 w-4 accent-forest" {...register('isDefault')} />
          Make this my default address
        </label>
      )}
      <div className="flex flex-wrap gap-3 pt-2 sm:col-span-2">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" size="lg" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
