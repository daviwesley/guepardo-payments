import { useState, useEffect } from 'react'
import { eachDayOfInterval, format, parseISO } from 'date-fns'
import { authService } from '@/lib/auth-amplify-new'

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

interface PixApiResponse {
  data: PixBankData[]
  total: number
  page: number
  per_page: number
}

interface PixStats {
  totalAmount: number
  totalTransactions: number
  pendingTransactions: number
  paidTransactions: number
  averageAmount: number
}

export function usePixData(dateFrom?: string, dateTo?: string) {
  const [data, setData] = useState<PixBankData[]>([])
  const [stats, setStats] = useState<PixStats>({
    totalAmount: 0,
    totalTransactions: 0,
    pendingTransactions: 0,
    paidTransactions: 0,
    averageAmount: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [daysWithData, setDaysWithData] = useState<string[]>([]) // Novo estado

  const fetchPixData = async () => {
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

    try {
      setLoading(true)
      setError(null)

      // Gerar array de datas entre dateFrom e dateTo
      const startDate = parseISO(defaultDateFrom)
      const endDate = parseISO(defaultDateTo)
      const daysInRange = eachDayOfInterval({ start: startDate, end: endDate })

      // Limitar a 30 dias para evitar muitas requisições simultâneas
      if (daysInRange.length > 30) {
        throw new Error(
          `Período muito longo: ${daysInRange.length} dias. Máximo permitido: 30 dias.`
        )
      }

      console.log(
        `🚀 OTIMIZAÇÃO: Fazendo ${daysInRange.length} requisições paralelas para o período de ${defaultDateFrom} até ${defaultDateTo}`
      )

      // Função para fazer uma requisição para um dia específico
      const fetchDayData = async (
        date: Date,
        index: number
      ): Promise<PixBankData[]> => {
        // Pequeno delay escalonado para evitar sobrecarga
        if (index > 0) {
          await new Promise((resolve) => setTimeout(resolve, 50 * index))
        }

        const dateStr = format(date, 'yyyy-MM-dd')
        const timestamp = Date.now()

        const url = `https://api.sandbox.pixntt.cloud/charge/general?date_from=${dateStr}&date_to=${dateStr}&_=${timestamp}`

        try {
          // Obter token atual do Amplify
          const token = await authService.getToken()

          if (!token) {
            console.warn('🔒 Token não encontrado. Usando dados mockados.')
            throw new Error('UNAUTHORIZED')
          }

          const response = await fetch(url, {
            method: 'GET',
            headers: {
              accept: 'application/json, text/javascript, */*; q=0.01',
              'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
              authorization: `Bearer ${token}`,
              origin: 'https://webapp.sandbox.pixntt.cloud',
              'sec-fetch-dest': 'empty',
              'sec-fetch-mode': 'cors',
              'sec-fetch-site': 'same-site',
              'user-agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
            },
          })

          if (!response.ok) {
            // Se for erro de autenticação (401 ou 403), usar dados mockados
            if (response.status === 401 || response.status === 403) {
              console.warn(
                `🔒 Token expirado/inválido para ${dateStr}. Usando dados mockados.`
              )
              throw new Error('UNAUTHORIZED')
            }
            console.warn(
              `⚠️ Erro na requisição para ${dateStr}: status ${response.status}`
            )
            return []
          }

          // Primeiro, obter o texto da resposta
          const responseText = await response.text()

          // Verificar se a API retornou a mensagem de "sem dados"
          if (responseText.trim() === 'Pesquisa não retornou dados') {
            console.log(
              `📭 ${dateStr}: Sem dados (API: "${responseText.trim()}")`
            )
            return []
          }

          // Verificar se a resposta parece ser JSON
          if (
            !responseText.trim().startsWith('[') &&
            !responseText.trim().startsWith('{')
          ) {
            console.error(
              `❌ Resposta não é JSON para ${dateStr}. Primeiros 200 chars:`,
              responseText.substring(0, 200)
            )
            return []
          }

          // Tentar fazer o parse do JSON
          let result: PixBankData[]
          try {
            result = JSON.parse(responseText)
          } catch (parseError) {
            console.error(
              `❌ Erro ao fazer parse JSON para ${dateStr}:`,
              parseError
            )
            console.error(
              `📄 Resposta recebida (primeiros 200 chars):`,
              responseText.substring(0, 200)
            )
            return []
          }

          // Verificar se result é um array
          if (!Array.isArray(result)) {
            console.warn(
              `⚠️ Resposta não é um array para ${dateStr}:`,
              typeof result
            )
            return []
          }

          console.log(`✅ ${dateStr}: ${result.length} registros`)

          // Processar dados e corrigir URLs das imagens
          return result.map((item) => ({
            ...item,
            bank_image_url: item.bank_image_url.replace(/\\\//g, '/'),
          }))
        } catch (fetchError) {
          console.error(`❌ Erro de rede para ${dateStr}:`, fetchError)
          return []
        }
      }

      // Fazer todas as requisições em paralelo usando Promise.all
      const allResults = await Promise.all(
        daysInRange.map((date, index) => fetchDayData(date, index))
      )

      // Combinar todos os resultados em um array único
      const combinedData = allResults.flat()

      // Coletar dias que têm dados reais (não vazios)
      const daysWithActualData = daysInRange.filter((date, index) => {
        const dayResult = allResults[index]
        return dayResult && dayResult.length > 0
      })

      console.log(
        `📅 Dias com dados reais: ${daysWithActualData.length}/${daysInRange.length}`
      )
      console.log(
        `📆 Datas com dados:`,
        daysWithActualData.map((date) => format(date, 'yyyy-MM-dd'))
      )

      // Estatísticas das requisições
      const totalRequests = daysInRange.length
      const successfulRequests = allResults.filter(
        (result) => result.length > 0
      ).length
      const emptyRequests = totalRequests - successfulRequests

      console.log(
        `📊 Resumo das requisições: ${successfulRequests}/${totalRequests} com dados, ${emptyRequests} vazias`
      )
      console.log(
        `📋 Total de registros brutos retornados: ${combinedData.length}`
      )

      // Debug: mostrar alguns registros brutos
      if (combinedData.length > 0) {
        console.log(
          `📝 Primeiros 3 registros brutos:`,
          combinedData.slice(0, 3)
        )
      }

      // Em vez de agregar por banco, vamos manter os dados por dia/banco
      // Isso garante que apenas dias com dados reais sejam mostrados
      const filteredData = combinedData.filter((item) => {
        // Manter apenas registros que têm alguma transação
        return item.total_count > 0 || item.total_amount > 0
      })

      console.log(
        `🎯 Dados filtrados: ${filteredData.length} registros com transações (de ${combinedData.length} totais)`
      )
      console.log(
        `📅 Dias/bancos com dados:`,
        filteredData.map(
          (item) =>
            `${item.f110_date} - ${item.bank_num} (${item.total_count} transações)`
        )
      )

      // Coletar dias únicos que têm dados REAIS baseado nos daysWithActualData
      const uniqueDaysWithData = daysWithActualData
        .map((date) => format(date, 'yyyy-MM-dd'))
        .sort()

      console.log(
        `📆 Dias únicos com dados (${uniqueDaysWithData.length}):`,
        uniqueDaysWithData
      )
      const processedResult = filteredData.map((item) => ({
        ...item,
        bank_image_url: item.bank_image_url.replace(/\\\//g, '/'),
        // Garantir que os percentuais estão corretos
        active_percent:
          item.total_amount > 0
            ? (item.active_amount / item.total_amount) * 100
            : 0,
        expired_percent:
          item.total_amount > 0
            ? (item.expired_amount / item.total_amount) * 100
            : 0,
        paid_percent:
          item.total_amount > 0
            ? (item.paid_amount / item.total_amount) * 100
            : 0,
      }))

      // Calcular estatísticas
      const totalAmount = processedResult.reduce(
        (sum, item) => sum + item.total_amount,
        0
      )
      const totalTransactions = processedResult.reduce(
        (sum, item) => sum + item.total_count,
        0
      )
      const paidTransactions = processedResult.reduce(
        (sum, item) => sum + item.paid_count,
        0
      )
      const pendingTransactions = processedResult.reduce(
        (sum, item) => sum + item.active_count,
        0
      )

      console.log(
        `📊 Dados finais: ${processedResult.length} registros dia/banco com transações`
      )
      console.log(
        `� Total: R$ ${totalAmount.toLocaleString('pt-BR')}, ${totalTransactions} transações`
      )

      setData(processedResult)
      setDaysWithData(uniqueDaysWithData) // Novo estado
      setStats({
        totalAmount,
        totalTransactions,
        pendingTransactions,
        paidTransactions,
        averageAmount:
          totalTransactions > 0 ? totalAmount / totalTransactions : 0,
      })
    } catch (err) {
      console.error('❌ Erro ao buscar dados PIX:', err)

      // Se for erro de autenticação, usar dados mockados
      if (err instanceof Error && err.message === 'UNAUTHORIZED') {
        console.log('🎭 Usando dados mockados devido ao token expirado')

        // Dados mockados para demonstração
        const mockData: PixBankData[] = [
          {
            bank_num: '341',
            bank_image_url:
              'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg',
            f110_date: defaultDateFrom,
            active_amount: 15000.5,
            expired_amount: 2500.0,
            paid_amount: 8750.25,
            active_count: 25,
            expired_count: 5,
            paid_count: 15,
            total_amount: 26250.75,
            total_count: 45,
            active_percent: 57.1,
            expired_percent: 9.5,
            paid_percent: 33.3,
          },
          {
            bank_num: '033',
            bank_image_url:
              'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg',
            f110_date: defaultDateFrom,
            active_amount: 12000.0,
            expired_amount: 1800.0,
            paid_amount: 6900.75,
            active_count: 20,
            expired_count: 3,
            paid_count: 12,
            total_amount: 20700.75,
            total_count: 35,
            active_percent: 58.0,
            expired_percent: 8.7,
            paid_percent: 33.3,
          },
          {
            bank_num: '237',
            bank_image_url:
              'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg',
            f110_date: defaultDateFrom,
            active_amount: 18500.0,
            expired_amount: 3200.5,
            paid_amount: 9800.25,
            active_count: 30,
            expired_count: 8,
            paid_count: 18,
            total_amount: 31500.75,
            total_count: 56,
            active_percent: 58.7,
            expired_percent: 10.2,
            paid_percent: 31.1,
          },
        ]

        setData(mockData)
        setStats({
          totalAmount: 78452.25,
          totalTransactions: 136,
          pendingTransactions: 75,
          paidTransactions: 45,
          averageAmount: 576.85,
        })

        setError('⚠️ Token expirado - usando dados de demonstração')
        return
      }

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
    loading,
    error,
    daysWithData, // Novo retorno
    refetch: fetchPixData,
  }
}