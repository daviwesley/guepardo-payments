'use client'

import { PixBankList } from '@/components/pix-bank-list'
import { DatePickerWithRange } from '@/components/date-range-picker'
import { PixPageSkeleton } from '@/components/pix-skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { usePixData } from '../../../hooks/usePixData'
import { DollarSign, Users, Clock, CheckCircle, XCircle, Filter, Calendar } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { DateRange } from 'react-day-picker'
import { CountUpCurrency, CountUpInteger } from '@/components/CountUpWrappers'

export default function PixPage() {
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

  // Estados locais sem dependência de URL
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    return { from: getWeekAgo(), to: getToday() }
  })
  
  const [groupByBank, setGroupByBank] = useState(false)
  
  // Estados para controle da API - só chama quando finalizado
  const [finalDateRange, setFinalDateRange] = useState<DateRange | undefined>(() => {
    return { from: getWeekAgo(), to: getToday() }
  })

  // Converter datas finais para string formato API
  const dateFrom = finalDateRange?.from ? dateToString(finalDateRange.from) : dateToString(getWeekAgo())
  const dateTo = finalDateRange?.to ? dateToString(finalDateRange.to) : dateToString(getToday())

  console.log('🎯 API será chamada com:', { dateFrom, dateTo })

  const { data, stats, loading, error, daysWithData } = usePixData(
    dateFrom,
    dateTo
  )

  // Função para lidar com mudança de datas (só chamada quando popover fecha)
  const handleDateRangeChange = (newRange: DateRange | undefined) => {
    // Só deve ser chamada quando o range estiver completo e popover fechado
    if (newRange?.from && newRange?.to) {
      setDateRange(newRange) // Atualiza visual
      setFinalDateRange(newRange) // Dispara API
    }
  }

  // Função para alternar agrupamento
  const handleGroupToggle = (value: boolean) => {
    setGroupByBank(value)
  }

  // Função para agrupar dados por banco
  const groupedData = useMemo(() => {
    if (!data || !groupByBank) return data

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

    return grouped
  }, [data, groupByBank])

  if (loading) return <PixPageSkeleton />
  if (error) return <div>Erro: {error}</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">PIX</h1>
        <p className="text-muted-foreground">
          Gerencie suas cobranças PIX por banco
        </p>

      </div>

      {/* Cards de resumo */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Transações</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CountUpInteger 
                value={stats.totalTransactions} 
                duration={0.5}
                delay={0.1}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CountUpCurrency 
                value={stats.totalAmount} 
                duration={0.5}
                delay={0.2}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              <CountUpInteger 
                value={stats.paidTransactions} 
                duration={0.5}
                delay={0.3}
                className="text-green-600"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              <CountUpInteger 
                value={stats.pendingTransactions} 
                duration={0.5}
                delay={0.4}
                className="text-blue-600"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CountUpCurrency 
                value={stats.averageAmount} 
                duration={0.5}
                delay={0.5}
              />
            </div>
          </CardContent>
        </Card>
      </div>

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
            const params = new URLSearchParams({
              bank_num: bankData.bank_num,
              bank_name: getBankName(bankData.bank_num),
              // Se agrupado por banco, usar data inicial do range
              // Se não agrupado, usar a data específica do registro
              date_from: groupByBank ? dateFrom : bankData.f110_date,
            })

            // Adicionar date_to e isGrouped quando estiver agrupado por banco
            if (groupByBank) {
              params.set('date_to', dateTo)
              params.set('is_grouped', 'true')

              // Adicionar dias com dados para otimização
              if (daysWithData && daysWithData.length > 0) {
                params.set('days_with_data', daysWithData.join(','))
              }
            }

            router.push(`/cobranca/pix/transacoes?${params.toString()}`)
          }}
        />
      </div>
    </div>
  )
}