import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { User } from '@/types'

/**
 * Demo-only authentication. Accounts live in this browser's localStorage.
 * Only name, email and phone are saved — passwords are validated in the form
 * and then discarded; they are never stored anywhere.
 */
interface AuthState {
  user: User | null
  accounts: Record<string, User>
  signUp: (input: User) => { ok: true } | { ok: false; error: string }
  signIn: (email: string) => { ok: true; user: User } | { ok: false; error: string }
  signOut: () => void
  updateProfile: (patch: Partial<Pick<User, 'name' | 'phone'>>) => void
  hasAccount: (email: string) => boolean
}

const norm = (email: string) => email.trim().toLowerCase()

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accounts: {},
      signUp: ({ name, email, phone }) => {
        const key = norm(email)
        if (get().accounts[key])
          return { ok: false, error: 'An account with this email already exists in this browser. Please sign in instead.' }
        const user: User = { name: name.trim(), email: key, phone }
        set((s) => ({ accounts: { ...s.accounts, [key]: user }, user }))
        return { ok: true }
      },
      signIn: (email) => {
        const user = get().accounts[norm(email)]
        if (!user) return { ok: false, error: 'We couldn’t find an account with this email in this browser. Create one in a few seconds.' }
        set({ user })
        return { ok: true, user }
      },
      signOut: () => set({ user: null }),
      updateProfile: (patch) => {
        const user = get().user
        if (!user) return
        const next = { ...user, ...patch }
        set((s) => ({ user: next, accounts: { ...s.accounts, [user.email]: next } }))
      },
      hasAccount: (email) => Boolean(get().accounts[norm(email)]),
    }),
    { name: 'sahu-marts-auth', storage: createJSONStorage(() => localStorage), version: 1 },
  ),
)

export function firstName(user: User | null): string {
  return user?.name.split(' ')[0] ?? ''
}
