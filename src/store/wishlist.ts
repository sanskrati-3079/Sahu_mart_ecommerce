import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface WishlistState {
  ids: string[]
  toggle: (id: string) => boolean
  remove: (id: string) => void
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const has = get().ids.includes(id)
        set({ ids: has ? get().ids.filter((x) => x !== id) : [id, ...get().ids] })
        return !has
      },
      remove: (id) => set({ ids: get().ids.filter((x) => x !== id) }),
    }),
    { name: 'sahu-marts-wishlist', storage: createJSONStorage(() => localStorage), version: 1 },
  ),
)
