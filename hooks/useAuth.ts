'use client'

import { useContext } from 'react'
import { AuthContext } from '@/lib/auth-context'

/**
 * Hook para acessar o contexto de autenticação
 * @returns {AuthContextType} Contexto de autenticação com user, isLoading, isAuthenticated, login, logout, getAppToken
 * @throws {Error} Se usado fora do AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}