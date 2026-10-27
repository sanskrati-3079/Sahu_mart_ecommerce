import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface PreferencesState {
  pincode: string
  recentSearches: string[]
  recentlyViewed: string[]
  setPincode: (pin: string) => void
  addSearch: (q: string) => void
  clearSearches: () => void
  addViewed: (id: string) => void
}

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      pincode: '',
      recentSearches: [],
      recentlyViewed: [],
      setPincode: (pincode) => set({ pincode }),
      addSearch: (q) => {
        const term = q.trim()
        if (!term) return
        set((s) => ({
          recentSearches: [term, ...s.recentSearches.filter((x) => x.toLowerCase() !== term.toLowerCase())].slice(0, 6),
        }))
      },
      clearSearches: () => set({ recentSearches: [] }),
      addViewed: (id) => set((s) => ({ recentlyViewed: [id, ...s.recentlyViewed.filter((x) => x !== id)].slice(0, 12) })),
    }),
    { name: 'sahu-marts-preferences', storage: createJSONStorage(() => localStorage), version: 1 },
  ),
)
