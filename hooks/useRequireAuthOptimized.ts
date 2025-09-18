'use client'

import { useAuth } from './useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

/**
 * Hook otimizado para rotas protegidas
 * Evita verificações desnecessárias se o usuário já está autenticado
 */
export const useRequireAuthOptimized = () => {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const redirectedRef = useRef(false)

  useEffect(() => {
    // Se ainda está carregando, aguardar
    if (isLoading) return

    // Se não está autenticado e ainda não redirecionou
    if (!isAuthenticated && !redirectedRef.current) {
      redirectedRef.current = true
      router.push('/login')
      return
    }

    // Se está autenticado, resetar flag de redirecionamento
    if (isAuthenticated) {
      redirectedRef.current = false
    }
  }, [isAuthenticated, isLoading, router])

  return { 
    isAuthenticated, 
    isLoading, 
    user,
    // Flag adicional para evitar renderizar conteúdo durante redirecionamento
    shouldRender: isAuthenticated || isLoading
  }
}