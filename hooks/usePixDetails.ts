import { useState, useEffect } from 'react'
import { authService } from '@/lib/auth-amplify-new'
import { PixDetails } from '@/types/pix-details'

export function usePixDetails(pixId: string) {
  const [details, setDetails] = useState<PixDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPixDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (!pixId) {
        throw new Error('PIX ID é obrigatório')
      }

      const timestamp = Date.now()
      const url = `https://api.sandbox.pixntt.cloud/charge/details?pix_id=${pixId}&_=${timestamp}`
      
      console.log(`🔍 Buscando detalhes do PIX: ${pixId}`)
      
      // Obter token atual do Amplify
      const token = await authService.getToken()
      
      if (!token) {
        console.warn('🔒 Token não encontrado. Não é possível buscar detalhes.')
        setError('Não autenticado')
        setLoading(false)
        return
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json, text/javascript, */*; q=0.01',
          'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          'authorization': `Bearer ${token}`,
          'origin': 'https://webapp.sandbox.pixntt.cloud',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
        }
      })

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`)
      }

      // Primeiro, obter o texto da resposta
      const responseText = await response.text()
      
      // Verificar se a API retornou a mensagem de "sem dados"
      if (responseText.trim() === 'Pesquisa não retornou dados') {
        throw new Error('PIX não encontrado ou sem dados disponíveis')
      }
      
      // Tentar fazer o parse do JSON
      let result: PixDetails
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        console.error('❌ Erro ao fazer parse JSON:', parseError)
        console.error('📄 Resposta recebida:', responseText.substring(0, 200))
        throw new Error('Erro ao processar resposta da API')
      }
      
      console.log('✅ Detalhes do PIX carregados:', result.pix_id)
      setDetails(result)

    } catch (err) {
      console.error('❌ Erro ao buscar detalhes do PIX:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (pixId) {
      fetchPixDetails()
    }
  }, [pixId])

  return {
    details,
    loading,
    error,
    refetch: fetchPixDetails
  }
}