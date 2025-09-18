'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ParseAuthPage() {
  const router = useRouter()

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log('🔄 Processando callback OAuth...')
        
        // O Amplify já processou o callback automaticamente
        // Apenas redirecionamos para o dashboard
        router.push('/cobranca/pix')
        
      } catch (error) {
        console.error('❌ Erro no callback OAuth:', error)
        router.push('/login?error=oauth_callback_failed')
      }
    }

    handleOAuthCallback()
  }, [router])

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">Processando autenticação...</p>
      </div>
    </div>
  )
}