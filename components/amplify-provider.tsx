'use client'

import { useEffect } from 'react'
import { configureAmplify } from '@/lib/amplify-config'

export function AmplifyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log('🔧 Configurando AWS Amplify...')
    configureAmplify()
    console.log('✅ AWS Amplify configurado com sucesso')
  }, [])

  return <>{children}</>
}