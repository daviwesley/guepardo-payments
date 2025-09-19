import { create } from 'zustand'
import { createStore } from 'zustand/vanilla'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// Auth Store Types
interface User {
  email: string
  username: string
  sub: string
  accessToken: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  setUser: (user: User) => void
  clearUser: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
}

export type AuthStore = AuthState & AuthActions

export const createAuthStore = () => {
  return createStore<AuthStore>()(
    devtools(
      persist(
        immer((set) => ({
          // State
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,

          // Actions
          setUser: (user) =>
            set((state) => {
              state.user = user
              state.isAuthenticated = true
              state.error = null
            }),

          clearUser: () =>
            set((state) => {
              state.user = null
              state.isAuthenticated = false
              state.error = null
            }),

          setLoading: (loading) =>
            set((state) => {
              state.isLoading = loading
            }),

          setError: (error) =>
            set((state) => {
              state.error = error
              state.isLoading = false
            }),

          logout: () =>
            set((state) => {
              state.user = null
              state.isAuthenticated = false
              state.error = null
              state.isLoading = false
            }),
        })),
        {
          name: 'auth-storage',
          partialize: (state) => ({
            user: state.user,
            isAuthenticated: state.isAuthenticated,
          }),
        }
      ),
      { name: 'auth-store' }
    )
  )
}

// For direct usage (backwards compatibility)
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      immer((set) => ({
        // State
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        setUser: (user: User) =>
          set((state) => {
            state.user = user
            state.isAuthenticated = true
            state.error = null
          }),

        clearUser: () =>
          set((state) => {
            state.user = null
            state.isAuthenticated = false
            state.error = null
          }),

        setLoading: (loading: boolean) =>
          set((state) => {
            state.isLoading = loading
          }),

        setError: (error: string | null) =>
          set((state) => {
            state.error = error
            state.isLoading = false
          }),

        logout: () =>
          set((state) => {
            state.user = null
            state.isAuthenticated = false
            state.error = null
            state.isLoading = false
          }),
      })),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'auth-store' }
  )
)