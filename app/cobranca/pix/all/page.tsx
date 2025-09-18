'use client'

import { useRequireAuthOptimized } from '@/hooks'
import { usePixData } from '../../../../hooks/usePixData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RefreshCw, Search, Filter, Download } from 'lucide-react'
import { PixBankList } from '@/components/pix-bank-list'
import { PixAllTransactionsSkeleton } from '@/components/pix-skeleton'
import { useState } from 'react'

export default function AllPixTransactionsPage() {
  const { shouldRender } = useRequireAuthOptimized()
  const { data: pixCharges, loading, error, refetch } = usePixData()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  if (!shouldRender) {
    return null
  }

  if (loading) {
    return <PixAllTransactionsSkeleton />
  }

  // Filtrar transações baseado na busca e filtro de status
  // Nota: Como usePixData retorna PixBankData, vamos adaptar a busca para os campos disponíveis
  const filteredCharges = pixCharges.filter((bankData) => {
    const matchesSearch = 
      bankData.bank_num.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bankData.f110_date.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Para statusFilter, vamos usar uma lógica baseada nos dados bancários disponíveis
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && bankData.active_count > 0) ||
      (statusFilter === 'paid' && bankData.paid_count > 0) ||
      (statusFilter === 'expired' && bankData.expired_count > 0)
    
    return matchesSearch && matchesStatus
  })

  // Função para exportar dados
  const handleExport = () => {
    console.log('Exportar transações')
    // Implementar exportação CSV/PDF
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dados Bancários PIX</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie os dados consolidados por banco
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" onClick={refetch} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por banco ou data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <label className="text-sm font-medium mb-2 block">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-3 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">Todos</option>
                <option value="paid">Com Pagamentos</option>
                <option value="active">Com Ativos</option>
                <option value="expired">Com Expirados</option>
              </select>
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Mais Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Transações */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Bancos ({filteredCharges.length})
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              {loading ? 'Carregando...' : `${filteredCharges.length} de ${pixCharges.length} bancos`}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PixBankList
            data={filteredCharges}
            loading={loading}
            error={error}
            isGrouped={false}
            onViewBankDetails={(bankData) => {
              console.log('Ver detalhes do banco:', bankData)
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}