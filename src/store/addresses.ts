import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Address } from '@/types'

type AddressInput = Omit<Address, 'id' | 'isDefault'> & { isDefault?: boolean }

interface AddressState {
  /** Addresses grouped by account email. */
  byUser: Record<string, Address[]>
  add: (email: string, input: AddressInput) => Address
  update: (email: string, id: string, input: AddressInput) => void
  remove: (email: string, id: string) => void
  setDefault: (email: string, id: string) => void
}

function withDefault(list: Address[], id?: string): Address[] {
  if (!list.length) return list
  const defaultId = id ?? list.find((a) => a.isDefault)?.id ?? list[0].id
  return list.map((a) => ({ ...a, isDefault: a.id === defaultId }))
}

export const useAddresses = create<AddressState>()(
  persist(
    (set, get) => ({
      byUser: {},
      add: (email, input) => {
        const list = get().byUser[email] ?? []
        const address: Address = { ...input, id: `addr-${Date.now().toString(36)}`, isDefault: false }
        const next = withDefault([...list, address], input.isDefault || list.length === 0 ? address.id : undefined)
        set((s) => ({ byUser: { ...s.byUser, [email]: next } }))
        return next.find((a) => a.id === address.id)!
      },
      update: (email, id, input) => {
        const list = (get().byUser[email] ?? []).map((a) => (a.id === id ? { ...a, ...input, id, isDefault: a.isDefault } : a))
        set((s) => ({ byUser: { ...s.byUser, [email]: withDefault(list, input.isDefault ? id : undefined) } }))
      },
      remove: (email, id) => {
        const list = (get().byUser[email] ?? []).filter((a) => a.id !== id)
        set((s) => ({ byUser: { ...s.byUser, [email]: withDefault(list) } }))
      },
      setDefault: (email, id) => set((s) => ({ byUser: { ...s.byUser, [email]: withDefault(s.byUser[email] ?? [], id) } })),
    }),
    { name: 'sahu-marts-addresses', storage: createJSONStorage(() => localStorage), version: 1 },
  ),
)
