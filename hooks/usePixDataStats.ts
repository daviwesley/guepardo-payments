import { useState, useEffect } from 'react'
import { authService } from '@/lib/auth-amplify-new'
import { eachDayOfInterval, format, parseISO } from 'date-fns'

interface PixBankData {
  bank_num: string
  bank_image_url: string
  f110_date: string
  active_amount: number
  expired_amount: number
  paid_amount: number
  active_count: number
  expired_count: number
  paid_count: number
  total_amount: number
  total_count: number
  active_percent: number
  expired_percent: number
  paid_percent: number
}

interface PixStats {
  totalAmount: number
  totalTransactions: number
  pendingTransactions: number
  paidTransactions: number
  averageAmount: number
}

interface PerformanceStats {
  requestCount: number
  totalTime: number
  avgTimePerRequest: number
  parallelTime: number
}

export function usePixDataWithStats(dateFrom?: string, dateTo?: string) {
  const [data, setData] = useState<PixBankData[]>([])
  const [stats, setStats] = useState<PixStats>({
    totalAmount: 0,
    totalTransactions: 0,
    pendingTransactions: 0,
    paidTransactions: 0,
    averageAmount: 0
  })
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats>({
    requestCount: 0,
    totalTime: 0,
    avgTimePerRequest: 0,
    parallelTime: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPixData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const startTime = performance.now()

      // Usar as datas fornecidas ou uma semana atrás como padrão
      const getWeekAgo = () => {
        const date = new Date()
        date.setDate(date.getDate() - 7)
        return date.toISOString().split('T')[0]
      }
      
      const getToday = () => {
        return new Date().toISOString().split('T')[0]
      }

      const defaultDateFrom = dateFrom || getWeekAgo()
      const defaultDateTo = dateTo || getToday()
      
      // Gerar array de datas entre dateFrom e dateTo
      const startDate = parseISO(defaultDateFrom)
      const endDate = parseISO(defaultDateTo)
      const daysInRange = eachDayOfInterval({ start: startDate, end: endDate })
      
      // Limitar a 30 dias para evitar muitas requisições simultâneas
      if (daysInRange.length > 30) {
        throw new Error(`Período muito longo: ${daysInRange.length} dias. Máximo permitido: 30 dias.`)
      }
      
      console.log(`🚀 OTIMIZAÇÃO: Fazendo ${daysInRange.length} requisições paralelas para o período de ${defaultDateFrom} até ${defaultDateTo}`)
      
      // Função para fazer uma requisição para um dia específico
      const fetchDayData = async (date: Date, index: number): Promise<{ data: PixBankData[], time: number }> => {
        const requestStart = performance.now()
        
        // Pequeno delay escalonado para evitar sobrecarga
        if (index > 0) {
          await new Promise(resolve => setTimeout(resolve, 50 * index))
        }
        
        const dateStr = format(date, 'yyyy-MM-dd')
        const timestamp = Date.now()
        
        const url = `https://api.sandbox.pixntt.cloud/charge/general?date_from=${dateStr}&date_to=${dateStr}&_=${timestamp}`
        
        // Obter token atual do Amplify
        const token = await authService.getToken()
        
        if (!token) {
          console.warn(`🔒 Token não encontrado para ${dateStr}. Pulando requisição.`)
          return { data: [], time: 0 }
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

        const requestTime = performance.now() - requestStart

        if (!response.ok) {
          console.warn(`⚠️ Erro na requisição para ${dateStr}: status ${response.status} (${requestTime.toFixed(0)}ms)`)
          return { data: [], time: requestTime }
        }

        // Primeiro, obter o texto da resposta
        const responseText = await response.text()
        
        // Verificar se a API retornou a mensagem de "sem dados"
        if (responseText.trim() === 'Pesquisa não retornou dados') {
          console.log(`ℹ️ ${dateStr}: Nenhum dado encontrado em ${requestTime.toFixed(0)}ms (API retornou: "${responseText.trim()}")`)
          return { data: [], time: requestTime }
        }
        
        // Tentar fazer o parse do JSON
        let result: PixBankData[]
        try {
          result = JSON.parse(responseText)
        } catch (parseError) {
          console.error(`❌ Erro ao fazer parse JSON para ${dateStr}:`, parseError)
          console.error(`📄 Resposta recebida (primeiros 200 chars):`, responseText.substring(0, 200))
          return { data: [], time: requestTime }
        }
        
        // Verificar se result é um array
        if (!Array.isArray(result)) {
          console.warn(`⚠️ Resposta não é um array para ${dateStr}:`, typeof result)
          return { data: [], time: requestTime }
        }
        
        console.log(`✅ ${dateStr}: ${result.length} registros em ${requestTime.toFixed(0)}ms`)
        
        // Processar dados e corrigir URLs das imagens
        const processedData = result.map(item => ({
          ...item,
          bank_image_url: item.bank_image_url.replace(/\\\//g, '/')
        }))
        
        return { data: processedData, time: requestTime }
      }
      
      // Fazer todas as requisições em paralelo usando Promise.all
      const allResults = await Promise.all(
        daysInRange.map((date, index) => fetchDayData(date, index))
      )
      
      const endTime = performance.now()
      const totalParallelTime = endTime - startTime
      
      // Separar dados e tempos
      const combinedData = allResults.flatMap(result => result.data)
      const requestTimes = allResults.map(result => result.time)
      const totalRequestTime = requestTimes.reduce((sum, time) => sum + time, 0)
      
      // Agregar dados por banco (bank_num) somando os valores
      const aggregatedData = new Map<string, PixBankData>()
      
      combinedData.forEach(item => {
        const existingItem = aggregatedData.get(item.bank_num)
        
        if (existingItem) {
          // Somar valores para o mesmo banco
          existingItem.active_amount += item.active_amount
          existingItem.expired_amount += item.expired_amount
          existingItem.paid_amount += item.paid_amount
          existingItem.active_count += item.active_count
          existingItem.expired_count += item.expired_count
          existingItem.paid_count += item.paid_count
          existingItem.total_amount += item.total_amount
          existingItem.total_count += item.total_count
          
          // Recalcular percentuais
          if (existingItem.total_amount > 0) {
            existingItem.active_percent = (existingItem.active_amount / existingItem.total_amount) * 100
            existingItem.expired_percent = (existingItem.expired_amount / existingItem.total_amount) * 100
            existingItem.paid_percent = (existingItem.paid_amount / existingItem.total_amount) * 100
          }
        } else {
          // Primeiro item para este banco
          aggregatedData.set(item.bank_num, { ...item })
        }
      })
      
      // Converter Map para array
      const processedResult = Array.from(aggregatedData.values())
      
      // Calcular estatísticas de negócio
      const totalAmount = processedResult.reduce((sum, item) => sum + item.total_amount, 0)
      const totalTransactions = processedResult.reduce((sum, item) => sum + item.total_count, 0)
      const paidTransactions = processedResult.reduce((sum, item) => sum + item.paid_count, 0)
      const pendingTransactions = processedResult.reduce((sum, item) => sum + item.active_count, 0)
      
      // Calcular estatísticas de performance
      const perfStats: PerformanceStats = {
        requestCount: daysInRange.length,
        totalTime: totalRequestTime,
        avgTimePerRequest: totalRequestTime / daysInRange.length,
        parallelTime: totalParallelTime
      }
      
      console.log(`📊 ESTATÍSTICAS DE PERFORMANCE:`)
      console.log(`- ${perfStats.requestCount} requisições paralelas`)
      console.log(`- Tempo total das requisições: ${perfStats.totalTime.toFixed(0)}ms`)
      console.log(`- Tempo médio por requisição: ${perfStats.avgTimePerRequest.toFixed(0)}ms`)
      console.log(`- Tempo total do processo: ${perfStats.parallelTime.toFixed(0)}ms`)
      console.log(`- Eficiência: ${((perfStats.totalTime / perfStats.parallelTime) * 100).toFixed(1)}% (quanto maior, melhor)`)
      console.log(`- Dados agregados: ${processedResult.length} bancos únicos`)
      
      setData(processedResult)
      setStats({
        totalAmount,
        totalTransactions,
        pendingTransactions,
        paidTransactions,
        averageAmount: totalTransactions > 0 ? totalAmount / totalTransactions : 0
      })
      setPerformanceStats(perfStats)

    } catch (err) {
      console.error('❌ Erro ao buscar dados PIX:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPixData()
  }, [dateFrom, dateTo])

  return {
    data,
    stats,
    performanceStats,
    loading,
    error,
    refetch: fetchPixData
  }
}