import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { usePixDataWithStats } from '../hooks/usePixDataStats'
import { format, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function PerformanceDemo() {
  // Usar um período de 7 dias para demonstração
  const dateTo = format(new Date(), 'yyyy-MM-dd')
  const dateFrom = format(subDays(new Date(), 6), 'yyyy-MM-dd')
  
  const { data, stats, performanceStats, loading, error } = usePixDataWithStats(dateFrom, dateTo)

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-red-600">Erro na Demonstração</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🚀 Demonstração de Otimização com Requisições Paralelas
            {loading && <Badge variant="secondary">Carregando...</Badge>}
          </CardTitle>
          <CardDescription>
            Período: {format(new Date(dateFrom), 'dd/MM/yyyy', { locale: ptBR })} até{' '}
            {format(new Date(dateTo), 'dd/MM/yyyy', { locale: ptBR })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Executando requisições paralelas...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Requisições</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {performanceStats.requestCount}
                  </div>
                  <p className="text-xs text-gray-500">paralelas</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Tempo Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {performanceStats.parallelTime.toFixed(0)}ms
                  </div>
                  <p className="text-xs text-gray-500">processo completo</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {performanceStats.avgTimePerRequest.toFixed(0)}ms
                  </div>
                  <p className="text-xs text-gray-500">por requisição</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Eficiência</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {((performanceStats.totalTime / performanceStats.parallelTime) * 100).toFixed(0)}%
                  </div>
                  <p className="text-xs text-gray-500">paralelização</p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {!loading && data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📊 Dados Agregados</CardTitle>
            <CardDescription>
              Resultados consolidados de {performanceStats.requestCount} requisições paralelas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  R$ {stats.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-sm text-gray-600">Valor Total</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {stats.totalTransactions.toLocaleString('pt-BR')}
                </div>
                <p className="text-sm text-gray-600">Transações Totais</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {data.length}
                </div>
                <p className="text-sm text-gray-600">Bancos Únicos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && (
        <Card>
          <CardHeader>
            <CardTitle>💡 Vantagens da Otimização</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-0.5">1</Badge>
                <div>
                  <p className="font-medium">Requisições Paralelas</p>
                  <p className="text-sm text-gray-600">
                    Em vez de fazer uma requisição com um intervalo grande, fazemos múltiplas requisições menores em paralelo.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-0.5">2</Badge>
                <div>
                  <p className="font-medium">Menor Carga na API</p>
                  <p className="text-sm text-gray-600">
                    Cada requisição processa menos dados, reduzindo o tempo de processamento no servidor.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-0.5">3</Badge>
                <div>
                  <p className="font-medium">Melhor UX</p>
                  <p className="text-sm text-gray-600">
                    O usuário vê os dados chegando progressivamente e pode acompanhar o progresso.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-0.5">4</Badge>
                <div>
                  <p className="font-medium">Falhas Isoladas</p>
                  <p className="text-sm text-gray-600">
                    Se uma requisição falhar, as outras continuam funcionando normalmente.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}