import { useState, useEffect } from 'react'
import { authService } from '@/lib/auth-amplify-new'

export interface PixHistoryLog {
  wk_instance_id: string
  row_id: string
  status: string
  customer_id: string
  date_time: string
  method: string
  icon_id: string
  desc: string
  date: string
  username: string
  id: string
  title: string
  pix_id: string
}

export function usePixHistory(pixId: string) {
  const [data, setData] = useState<PixHistoryLog[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHistory = async () => {
    if (!pixId) return

    try {
      setLoading(true)
      setError(null)

      const token = await authService.getToken()
      if (!token) {
        throw new Error('Não autenticado')
      }

      const url = `https://api.sandbox.pixntt.cloud/history/${pixId}`
      
      console.log(`🔍 Buscando histórico para PIX ID: ${pixId}`)

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
        throw new Error(`Erro na requisição: ${response.status}`)
      }

      const responseText = await response.text()
      
      if (responseText.trim() === 'Pesquisa não retornou dados') {
        console.log(`📭 PIX ${pixId}: Sem histórico encontrado`)
        setData([])
        return
      }
      
      if (!responseText.trim().startsWith('[') && !responseText.trim().startsWith('{')) {
        throw new Error('Resposta inválida da API')
      }

      const result: PixHistoryLog[] = JSON.parse(responseText)
      
      if (!Array.isArray(result)) {
        throw new Error('Resposta da API não é um array')
      }

      // Ordenar por data mais recente primeiro
      const sortedData = result.sort((a, b) => 
        new Date(b.date_time).getTime() - new Date(a.date_time).getTime()
      )

      console.log(`✅ PIX ${pixId}: ${sortedData.length} logs de histórico encontrados`)
      setData(sortedData)
    } catch (err) {
      console.error('❌ Erro ao buscar histórico:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [pixId])

  return { data, loading, error, refetch: fetchHistory }
}