'use client'

import { PixBankList } from '@/components/pix-bank-list'
import { DatePickerWithRange } from '@/components/date-range-picker'
import { PixPageSkeleton } from '@/components/pix-skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { usePixData } from '../../../../hooks/usePixData'
import { DollarSign, Users, Clock, CheckCircle, XCircle, Filter, Calendar } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { DateRange } from 'react-day-picker'

export default function PixTestePage() {
  const router = useRouter()
  
  // Função para obter nome do banco
  const getBankName = (bankNum: string) => {
    const bankNames: { [key: string]: string } = {
      '033': 'Banco Santander S.A.',
      '077': 'Banco Inter S.A.',
      '341': 'Itaú Unibanco S.A.',
      '237': 'Banco Bradesco S.A.',
      '104': 'Caixa Econômica Federal',
      '001': 'Banco do Brasil S.A.'
    }
    return bankNames[bankNum] || `Banco ${bankNum}`
  }
  
  // Função para obter data de uma semana atrás
  const getWeekAgo = () => {
    const date = new Date()
    date.setDate(date.getDate() - 7)
    return date
  }

  // Função para obter data de hoje
  const getToday = () => {
    return new Date()
  }

  // Função para converter Date para string no formato YYYY-MM-DD (fuso horário local)
  const dateToString = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Estados simples sem sincronização com URL
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    return { from: getWeekAgo(), to: getToday() }
  })
  
  const [groupByBank, setGroupByBank] = useState(false)

  // Converter datas para string formato API
  const dateFrom = dateRange?.from ? dateToString(dateRange.from) : dateToString(getWeekAgo())
  const dateTo = dateRange?.to ? dateToString(dateRange.to) : dateToString(getToday())

  console.log('🧪 [TESTE] Buscando dados para período:', { dateFrom, dateTo })

  const { data, stats, loading, error } = usePixData(dateFrom, dateTo)

  // Função para agrupar dados por banco
  const groupedData = useMemo(() => {
    if (!data || !groupByBank) return data

    console.log('🧪 [TESTE] Agrupando dados por banco...')

    const grouped = data.reduce((acc, item) => {
      const existingBank = acc.find(bank => bank.bank_num === item.bank_num)
      
      if (existingBank) {
        // Somar valores para o mesmo banco
        existingBank.active_amount += item.active_amount
        existingBank.expired_amount += item.expired_amount
        existingBank.paid_amount += item.paid_amount
        existingBank.active_count += item.active_count
        existingBank.expired_count += item.expired_count
        existingBank.paid_count += item.paid_count
        existingBank.total_amount += item.total_amount
        existingBank.total_count += item.total_count
        
        // Recalcular percentuais
        if (existingBank.total_count > 0) {
          existingBank.active_percent = (existingBank.active_count / existingBank.total_count) * 100
          existingBank.expired_percent = (existingBank.expired_count / existingBank.total_count) * 100
          existingBank.paid_percent = (existingBank.paid_count / existingBank.total_count) * 100
        }
        
        // Manter a data mais recente
        if (item.f110_date > existingBank.f110_date) {
          existingBank.f110_date = item.f110_date
        }
      } else {
        // Adicionar novo banco
        acc.push({ ...item })
      }
      
      return acc
    }, [] as typeof data)

    console.log('🧪 [TESTE] Dados agrupados:', grouped.length, 'bancos')
    return grouped
  }, [data, groupByBank])

  // Função simples para lidar com mudança de datas
  const handleDateRangeChange = (newRange: DateRange | undefined) => {
    console.log('🧪 [TESTE] Mudança de data:', newRange)
    setDateRange(newRange)
  }

  // Função simples para alternar agrupamento
  const handleGroupToggle = (value: boolean) => {
    console.log('🧪 [TESTE] Alternar agrupamento:', value)
    setGroupByBank(value)
  }

  if (loading) return <PixPageSkeleton />
  if (error) return <div>Erro: {error}</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">PIX - Página de Teste</h1>
        <p className="text-muted-foreground">
          Versão simplificada sem useEffect/searchParams - Gerencie suas cobranças PIX por banco
        </p>
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            🧪 <strong>Página de Teste:</strong> Esta é uma versão sem sincronização com URL para testar a seleção de datas.
            <a href="/cobranca/pix" className="underline font-medium ml-1">Voltar à versão original</a>
          </p>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Transações</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(stats.totalAmount)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.paidTransactions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.pendingTransactions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(stats.averageAmount)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Debug info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-sm text-blue-800">🔧 Debug Info</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-700">
          <div><strong>Date From:</strong> {dateFrom}</div>
          <div><strong>Date To:</strong> {dateTo}</div>
          <div><strong>Agrupado por Banco:</strong> {groupByBank ? 'Sim' : 'Não'}</div>
          <div><strong>Dados carregados:</strong> {data?.length || 0} registros</div>
          <div><strong>Dados processados:</strong> {groupedData?.length || 0} itens</div>
        </CardContent>
      </Card>

      {/* Lista de bancos */}
      <div>
        {/* Controles de filtro */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Período:</span>
            </div>
            <DatePickerWithRange
              date={dateRange}
              onDateChange={handleDateRangeChange}
            />
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
            <Button
              variant={!groupByBank ? "default" : "outline"}
              size="sm"
              onClick={() => handleGroupToggle(false)}
              className="flex items-center justify-center space-x-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Por Data</span>
            </Button>
            <Button
              variant={groupByBank ? "default" : "outline"}
              size="sm"
              onClick={() => handleGroupToggle(true)}
              className="flex items-center justify-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Agrupado por Banco</span>
            </Button>
          </div>
        </div>

        <PixBankList 
          data={groupedData || []} 
          loading={loading} 
          error={error}
          isGrouped={groupByBank}
          onViewBankDetails={(bankData) => {
            console.log('🧪 [TESTE] Navegando para detalhes:', bankData)
            const params = new URLSearchParams({
              bank_num: bankData.bank_num,
              bank_name: getBankName(bankData.bank_num),
              // Se agrupado por banco, usar data inicial do range
              // Se não agrupado, usar a data específica do registro
              date_from: groupByBank ? dateFrom : bankData.f110_date
            })
            
            router.push(`/cobranca/pix/transacoes?${params.toString()}`)
          }}
        />
      </div>
    </div>
  )
}