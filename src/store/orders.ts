import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Order } from '@/types'

interface OrderState {
  orders: Order[]
  place: (order: Order) => void
  cancel: (id: string) => void
  find: (id: string) => Order | undefined
}

export const useOrders = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      place: (order) => set((s) => ({ orders: [order, ...s.orders] })),
      cancel: (id) => set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, cancelledAt: new Date().toISOString() } : o)) })),
      find: (id) => get().orders.find((o) => o.id.toUpperCase() === id.trim().toUpperCase()),
    }),
    { name: 'sahu-marts-orders', storage: createJSONStorage(() => localStorage), version: 1 },
  ),
)

export function generateOrderId(): string {
  return `SM-DEMO-${Math.floor(10000 + Math.random() * 90000)}`
}
