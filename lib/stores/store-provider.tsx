'use client'

import { ReactNode } from 'react'
import { AuthStoreProvider } from './auth-store-provider'

interface StoreProviderProps {
  children: ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  return (
    <AuthStoreProvider>
      {children}
    </AuthStoreProvider>
  )
}