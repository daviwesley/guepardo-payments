'use client'

import { usePixTransactions } from '@/hooks/usePixTransactions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'
import { 
  FileText, 
  RefreshCw,
  Search,
  Filter
} from 'lucide-react'
import { useState, useMemo } from 'react'
import Image from 'next/image'

interface PixTransactionsListProps {
  bankNum: string
  bankName: string
  dateFrom?: string
  dateTo?: string
  isGrouped?: boolean
}

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case 'ATIVA':
    case 'ATIVO':
      return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100'
    case 'PAGO':
    case 'CONCLUIDA':
      return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100'
    case 'CANCELADO':
    case 'CANCELADA':
      return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100'
    case 'EXPIRADO':
    case 'EXPIRADA':
      return 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100'
    case 'REMOVIDA_PELO_USUARIO_RECEBEDOR':
      return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100'
  }
}

const formatCurrency = (value: number | string) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numValue)
}

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('pt-BR')
  } catch {
    return dateString
  }
}

export function PixTransactionsList({
  bankNum,
  bankName,
  dateFrom,
  dateTo,
  isGrouped = false,
}: PixTransactionsListProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const { data, loading, error, refetch } = usePixTransactions({
    bankNum,
    dateFrom,
    dateTo,
    enabled: true,
    isGrouped,
  })

  // Filtrar e buscar transações
  const filteredData = useMemo(() => {
    let filtered = data

    // Filtro por busca (nome, CPF/CNPJ, email)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (transaction) =>
          transaction.customer_name.toLowerCase().includes(term) ||
          transaction.customer_cpf.includes(term) ||
          transaction.customer_cnpj.includes(term) ||
          transaction.customer_email.toLowerCase().includes(term) ||
          transaction.txid.toLowerCase().includes(term)
      )
    }

    // Filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        (transaction) =>
          transaction.status.toUpperCase() === statusFilter.toUpperCase()
      )
    }

    return filtered
  }, [data, searchTerm, statusFilter])

  // Obter lista única de status para o filtro
  const availableStatuses = useMemo(() => {
    const statuses = Array.from(new Set(data.map((t) => t.status)))
    return statuses.sort()
  }, [data])

  // Navegar para a página de detalhes do PIX
  const handleCardClick = (pixId: string) => {
    router.push(`/cobranca/pix/detail/${pixId}`)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48 mt-2" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">
                      <Skeleton className="h-4 w-12" />
                    </th>
                    <th className="text-left p-2">
                      <Skeleton className="h-4 w-24" />
                    </th>
                    <th className="text-left p-2">
                      <Skeleton className="h-4 w-16" />
                    </th>
                    <th className="text-left p-2">
                      <Skeleton className="h-4 w-10" />
                    </th>
                    <th className="text-left p-2">
                      <Skeleton className="h-4 w-20" />
                    </th>
                    <th className="text-left p-2">
                      <Skeleton className="h-4 w-12" />
                    </th>
                    <th className="text-left p-2">
                      <Skeleton className="h-4 w-12" />
                    </th>
                    <th className="text-left p-2">
                      <Skeleton className="h-4 w-20" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-2">
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-6 w-6 rounded-full" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </td>
                      <td className="p-2">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="p-2">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="p-2">
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td className="p-2">
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td className="p-2">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="p-2">
                        <Skeleton className="h-5 w-12 rounded-full" />
                      </td>
                      <td className="p-2">
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="text-red-600">
              <FileText className="h-12 w-12 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">
                Erro ao carregar transações
              </h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Transações - {bankName}</h2>
          <p className="text-muted-foreground">
            {filteredData.length} de {data.length} transação
            {data.length !== 1 ? 'ões' : ''}
            {searchTerm || statusFilter !== 'all' ? ' (filtradas)' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, CPF/CNPJ, email ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {availableStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Lista de transações */}
      {filteredData.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="text-center space-y-4">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold">
                  {data.length === 0
                    ? 'Nenhuma transação encontrada'
                    : 'Nenhuma transação corresponde aos filtros'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {data.length === 0
                    ? 'Não há transações para este banco no período selecionado.'
                    : 'Tente ajustar os filtros de busca ou status.'}
                </p>
              </div>
              {(searchTerm || statusFilter !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('all')
                  }}
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Banco
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Documento SAP
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Cliente
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Data
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Vencimento
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Valor
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Status QR Code
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((transaction) => (
                    <tr
                      key={transaction.wk_instance_id}
                      className="border-b hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => handleCardClick(transaction.pix_id)}
                    >
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <img
                            src={transaction.bank_image_url}
                            alt={transaction.bank_image_name}
                            className="w-6 h-6 rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                            }}
                          />
                          <span className="font-medium">
                            {transaction.bank_num}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-mono">
                        {transaction.txid.substring(0, 20)}...
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <div className="font-medium">
                            {transaction.customer_name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            #{transaction.customer_number}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {formatDate(transaction.f110_date)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {formatDate(transaction.due_date)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="font-semibold text-green-600">
                          {formatCurrency(transaction.value)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}