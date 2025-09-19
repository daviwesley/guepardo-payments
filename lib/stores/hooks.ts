import { useAuthStore } from '@/lib/stores'

// Auth Store Hooks
export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoading = useAuthStore((state) => state.isLoading)
  const error = useAuthStore((state) => state.error)

  const setUser = useAuthStore((state) => state.setUser)
  const clearUser = useAuthStore((state) => state.clearUser)
  const setLoading = useAuthStore((state) => state.setLoading)
  const setError = useAuthStore((state) => state.setError)
  const logout = useAuthStore((state) => state.logout)

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    setUser,
    clearUser,
    setLoading,
    setError,
    logout,
  }
}

export function useUser() {
  return useAuthStore((state) => state.user)
}

export function useIsAuthenticated() {
  return useAuthStore((state) => state.isAuthenticated)
}