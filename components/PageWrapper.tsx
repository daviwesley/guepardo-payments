'use client'

import { useAuth } from '@/hooks'
import { ReactNode, useMemo } from 'react'
import Loading from '@/components/ui/loading'

interface PageWrapperProps {
  children: ReactNode
  className?: string
}

export default function PageWrapper({ children, className = '' }: PageWrapperProps) {
  const { isAuthenticated, isLoading } = useAuth()
  
  const computedClassName = useMemo(() => {
    return `${isAuthenticated ? 'pt-16' : ''} ${className}`
  }, [isAuthenticated, className])

  // Mostrar loading apenas no carregamento inicial (não em navegações)
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Loading 
          className="min-h-screen" 
          size="lg" 
          text="Carregando aplicação..." 
        />
      </div>
    )
  }
  
  return (
    <div className={computedClassName}>
      {children}
    </div>
  )
}