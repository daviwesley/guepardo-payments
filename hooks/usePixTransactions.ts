import { useState, useEffect } from 'react'
import { authService } from '@/lib/auth-amplify-new'
import type { PixTransaction } from '@/lib/stores'

interface UsePixTransactionsParams {
  bankNum: string
  dateFrom?: string
  dateTo?: string
  enabled?: boolean
  isGrouped?: boolean
  daysWithData?: string[] // Nova propriedade
}

export function usePixTransactions({
  bankNum,
  dateFrom,
  dateTo,
  enabled = true,
  isGrouped = false,
  daysWithData, // Nova propriedade
}: UsePixTransactionsParams) {
  const [data, setData] = useState<PixTransaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactionsForSingleDate = async (
    bankNum: string,
    dateFrom?: string
  ) => {
    const defaultDateFrom = dateFrom || new Date().toISOString().split('T')[0]
    const timestamp = Date.now()
    const url = `https://api.sandbox.pixntt.cloud/charge/details?bank_num=${bankNum}&date_from=${defaultDateFrom}&_=${timestamp}`

    console.log(
      `🔍 Buscando transações para banco ${bankNum} a partir de ${defaultDateFrom}`
    )

    const token = await authService.getToken()
    if (!token) {
      throw new Error('Não autenticado')
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
      throw new Error(`Erro na requisição: ${response.status}`)
    }

    const responseText = await response.text()

    if (responseText.trim() === 'Pesquisa não retornou dados') {
      console.log(`📭 Banco ${bankNum}: Sem transações encontradas`)
      return []
    }

    if (
      !responseText.trim().startsWith('[') &&
      !responseText.trim().startsWith('{')
    ) {
      throw new Error('Resposta inválida da API')
    }

    const result: PixTransaction[] = JSON.parse(responseText)

    if (!Array.isArray(result)) {
      throw new Error('Resposta da API não é um array')
    }

    console.log(`✅ Banco ${bankNum}: ${result.length} transações encontradas`)
    return result
  }

  const fetchTransactionsForPeriod = async (
    bankNum: string,
    dateFrom: string,
    dateTo: string
  ) => {
    const { eachDayOfInterval, parseISO, format } = await import('date-fns')

    const startDate = parseISO(dateFrom)
    const endDate = parseISO(dateTo)
    let daysToQuery = eachDayOfInterval({ start: startDate, end: endDate })

    // 🎯 OTIMIZAÇÃO: Se temos informação dos dias com dados, usar apenas esses
    if (daysWithData && daysWithData.length > 0) {
      const daysWithDataAsStrings = daysWithData
      daysToQuery = daysToQuery.filter((date) => {
        const dateStr = format(date, 'yyyy-MM-dd')
        return daysWithDataAsStrings.includes(dateStr)
      })

      console.log(
        `🎯 OTIMIZAÇÃO: Filtrando dias. Total no período: ${eachDayOfInterval({ start: startDate, end: endDate }).length}, Com dados: ${daysToQuery.length}`
      )
      console.log(
        `📅 Dias que serão consultados:`,
        daysToQuery.map((d) => format(d, 'yyyy-MM-dd'))
      )
    }

    // Limitar a 30 dias para evitar muitas requisições simultâneas
    if (daysToQuery.length > 30) {
      throw new Error(
        `Período muito longo: ${daysToQuery.length} dias. Máximo permitido: 30 dias.`
      )
    }

    console.log(
      `🚀 AGRUPAMENTO: Fazendo ${daysToQuery.length} requisições paralelas para banco ${bankNum}${daysWithData ? ' (otimizado)' : ''}`
    )

    const fetchDayTransactions = async (
      date: Date,
      index: number
    ): Promise<PixTransaction[]> => {
      if (index > 0) {
        await new Promise((resolve) => setTimeout(resolve, 100 * index))
      }

      const dateStr = format(date, 'yyyy-MM-dd')

      try {
        console.log(
          `📅 Buscando transações para ${dateStr} (${index + 1}/${daysToQuery.length})`
        )
        const dayTransactions = await fetchTransactionsForSingleDate(
          bankNum,
          dateStr
        )
        console.log(
          `✅ ${dateStr}: ${dayTransactions.length} transações encontradas`
        )
        return dayTransactions
      } catch (error) {
        console.warn(`⚠️ Erro ao buscar transações para ${dateStr}:`, error)
        return []
      }
    }

    const allResults = await Promise.all(
      daysToQuery.map((date, index) => fetchDayTransactions(date, index))
    )

    const allTransactions = allResults.flat()
    console.log(
      `🎯 TOTAL CONSOLIDADO: ${allTransactions.length} transações do banco ${bankNum}`
    )
    return allTransactions
  }

  const fetchTransactions = async () => {
    if (!enabled) return

    try {
      setLoading(true)
      setError(null)

      let transactions: PixTransaction[] = []

      if (isGrouped && dateFrom && dateTo) {
        console.log(
          `🏦 Buscando transações agrupadas do banco ${bankNum} de ${dateFrom} até ${dateTo}`
        )
        transactions = await fetchTransactionsForPeriod(
          bankNum,
          dateFrom,
          dateTo
        )
      } else {
        transactions = await fetchTransactionsForSingleDate(bankNum, dateFrom)
      }

      setData(transactions)
    } catch (err) {
      console.error('❌ Erro ao buscar transações:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!bankNum || !enabled) return
    fetchTransactions()
  }, [bankNum, dateFrom, dateTo, enabled, isGrouped])

  return { data, loading, error, refetch: fetchTransactions }
}

// Hook legacy para compatibilidade com componentes antigos
export function usePixTransactionsLegacy(bankNum: string, dateFrom?: string) {
  return usePixTransactions({ bankNum, dateFrom, enabled: true })
}
