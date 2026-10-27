import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { getProductById } from '@/lib/catalog'
import type { CartItem } from '@/types'

interface AddInput {
  productId: string
  sku: string
  color?: string
  size?: string
  quantity?: number
}

interface CartState {
  items: CartItem[]
  couponCode?: string
  /** Single item sent straight to checkout via "Buy Now"; never mixed into the bag. */
  buyNow: CartItem | null
  drawerOpen: boolean
  add: (input: AddInput) => { added: number; capped: boolean }
  setQuantity: (key: string, quantity: number) => void
  remove: (key: string) => void
  clear: () => void
  applyCoupon: (code: string) => void
  removeCoupon: () => void
  setBuyNow: (input: AddInput) => void
  clearBuyNow: () => void
  setDrawerOpen: (open: boolean) => void
}

function stockFor(productId: string, sku: string): number {
  return getProductById(productId)?.variants.find((v) => v.sku === sku)?.stock ?? 0
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: undefined,
      buyNow: null,
      drawerOpen: false,
      add: ({ productId, sku, color, size, quantity = 1 }) => {
        const key = `${productId}::${sku}`
        const stock = stockFor(productId, sku)
        const existing = get().items.find((i) => i.key === key)
        const current = existing?.quantity ?? 0
        const next = Math.min(stock, current + quantity)
        const added = Math.max(0, next - current)
        if (added > 0) {
          set((state) => ({
            items: existing
              ? state.items.map((i) => (i.key === key ? { ...i, quantity: next } : i))
              : [...state.items, { key, productId, sku, color, size, quantity: next }],
          }))
        }
        return { added, capped: next < current + quantity }
      },
      setQuantity: (key, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.key === key ? { ...i, quantity: Math.min(stockFor(i.productId, i.sku), Math.max(1, quantity)) } : i))
            .filter((i) => i.quantity > 0),
        })),
      remove: (key) => set((state) => ({ items: state.items.filter((i) => i.key !== key) })),
      clear: () => set({ items: [], couponCode: undefined }),
      applyCoupon: (code) => set({ couponCode: code.trim().toUpperCase() }),
      removeCoupon: () => set({ couponCode: undefined }),
      setBuyNow: ({ productId, sku, color, size, quantity = 1 }) =>
        set({
          buyNow: {
            key: `${productId}::${sku}`,
            productId,
            sku,
            color,
            size,
            quantity: Math.min(stockFor(productId, sku), quantity),
          },
        }),
      clearBuyNow: () => set({ buyNow: null }),
      setDrawerOpen: (open) => set({ drawerOpen: open }),
    }),
    {
      name: 'sahu-marts-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items, couponCode: s.couponCode, buyNow: s.buyNow }),
      version: 1,
    },
  ),
)

export const selectCartCount = (s: CartState) => s.items.reduce((n, i) => n + i.quantity, 0)
