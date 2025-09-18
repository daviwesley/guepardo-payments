'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './useAuth'

/**
 * Hook para proteger rotas que requerem autenticação
 * Redireciona automaticamente para /login se o usuário não estiver autenticado
 * @returns {object} Estado de autenticação { isAuthenticated, isLoading }
 */
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Usar router.push para navegação SPA mais rápida
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  return { isAuthenticated, isLoading }
}