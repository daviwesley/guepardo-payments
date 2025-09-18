import { useState, useEffect } from 'react'
import { authService } from '@/lib/auth-amplify-new'

export interface PixTransaction {
  wk_instance_id: string
  customer_name: string
  customer_name2: string
  status: string
  customer_number: string
  f110_date: string
  customer_cpf: string
  customer_cnpj: string
  customer_email: string
  customer_phone: string
  customer_cellphone: string
  customer_city: string
  customer_state_code: string
  customer_street: string
  customer_district: string
  customer_zipcode: string
  value: number
  original_value: string
  due_date: string
  bank_num: string
  bank_image_url: string
  bank_image_name: string
  status_filter: string
  txid: string
  pix_id: string
  pdf_link: string
  charge_datetime: string
  date_time: string
  note: string
  multa: string
  juros: string
  discount_value: string
  discount_percentage: string
  payment_type: string
  qr_code: {
    imagemQrcode: string
    qrcode: string
  }
  cob: {
    devedor: {
      nome: string
      cpf: string
      cnpj: string
      cidade: string
      uf: string
      logradouro: string
      cep: string
    }
    valor: {
      original: string
    }
    status: string
    chave: string
    txid: string
  }
}

interface UsePixTransactionsParams {
  bankNum?: string
  dateFrom?: string
  dateTo?: string
  enabled?: boolean
}

export function usePixTransactions({ 
  bankNum, 
  dateFrom, 
  dateTo, 
  enabled = false 
}: UsePixTransactionsParams) {
  const [data, setData] = useState<PixTransaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async () => {
    if (!bankNum || !enabled) return
    
    try {
      setLoading(true)
      setError(null)

      // Usar dateFrom ou uma semana atrás como padrão
      const getWeekAgo = () => {
        const date = new Date()
        date.setDate(date.getDate() - 7)
        return date.toISOString().split('T')[0]
      }
      
      const getToday = () => {
        return new Date().toISOString().split('T')[0]
      }

      const defaultDateFrom = dateFrom || getWeekAgo()
      const timestamp = Date.now()
      
      // A API só aceita date_from, não date_to
      const url = `https://api.sandbox.pixntt.cloud/charge/details?bank_num=${bankNum}&date_from=${defaultDateFrom}&_=${timestamp}`
      
      console.log(`🔍 Buscando transações para banco ${bankNum} a partir de ${defaultDateFrom}`)
      
      // Obter token atual do Amplify
      const token = await authService.getToken()
      
      if (!token) {
        console.warn('🔒 Token não encontrado. Não é possível buscar transações.')
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
        throw new Error(`Erro na requisição: ${response.status}`)
      }

      // Primeiro, obter o texto da resposta
      const responseText = await response.text()
      
      // Verificar se a API retornou a mensagem de "sem dados"
      if (responseText.trim() === 'Pesquisa não retornou dados') {
        console.log(`📭 Banco ${bankNum}: Sem transações encontradas`)
        setData([])
        return
      }
      
      // Verificar se a resposta parece ser JSON
      if (!responseText.trim().startsWith('[') && !responseText.trim().startsWith('{')) {
        console.error(`❌ Resposta não é JSON para banco ${bankNum}. Primeiros 200 chars:`, responseText.substring(0, 200))
        throw new Error('Resposta inválida da API')
      }

      // Tentar fazer o parse do JSON
      let result: PixTransaction[]
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        console.error(`❌ Erro ao fazer parse JSON para banco ${bankNum}:`, parseError)
        throw new Error('Erro ao processar resposta da API')
      }

      // Verificar se result é um array
      if (!Array.isArray(result)) {
        console.warn(`⚠️ Resposta não é um array para banco ${bankNum}:`, typeof result)
        throw new Error('Formato de resposta inesperado')
      }

      console.log(`✅ Banco ${bankNum}: ${result.length} transações encontradas`)
      
      // Processar dados e corrigir URLs das imagens
      const processedResult = result.map(item => ({
        ...item,
        bank_image_url: item.bank_image_url.replace(/\\\//g, '/')
      }))
      
      setData(processedResult)

    } catch (err) {
      console.error('❌ Erro ao buscar transações:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (enabled && bankNum) {
      fetchTransactions()
    }
  }, [bankNum, dateFrom, dateTo, enabled])

  return {
    data,
    loading,
    error,
    refetch: fetchTransactions
  }
}