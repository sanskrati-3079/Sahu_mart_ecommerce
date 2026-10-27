import type { Address } from '@/types'

export type AddressData = Omit<Address, 'id' | 'isDefault'> & { isDefault: boolean }

export function toAddressData({ fullName, phone, pincode, line1, line2, landmark, city, state, isDefault }: Address): AddressData {
  return { fullName, phone, pincode, line1, line2, landmark, city, state, isDefault }
}
