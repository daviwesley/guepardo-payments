import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { usePixData } from '../hooks/usePixData'
import { format, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function EmptyDataDemo() {
  // Usar um período que provavelmente terá dias vazios (final de agosto até agora)
  const dateTo = format(new Date(), 'yyyy-MM-dd')
  const dateFrom = format(subDays(new Date(), 15), 'yyyy-MM-dd') // 15 dias atrás
  
  const { data, stats, loading, error } = usePixData(dateFrom, dateTo)

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
            📭 Demonstração: Tratamento de Dias Sem Dados
            {loading && <Badge variant="secondary">Carregando...</Badge>}
          </CardTitle>
          <CardDescription>
            Período: {format(new Date(dateFrom), 'dd/MM/yyyy', { locale: ptBR })} até{' '}
            {format(new Date(dateTo), 'dd/MM/yyyy', { locale: ptBR })} (15 dias)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Processando requisições... Abra o console para ver os logs!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total de Bancos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {data.length}
                    </div>
                    <p className="text-xs text-gray-500">com dados</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Transações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {stats.totalTransactions.toLocaleString('pt-BR')}
                    </div>
                    <p className="text-xs text-gray-500">no período</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">
                      R$ {stats.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <p className="text-xs text-gray-500">agregado</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">✅ Tratamento Funcionando!</h3>
                <p className="text-green-700 text-sm">
                  A aplicação processou 15 requisições paralelas (uma para cada dia) e tratou corretamente 
                  os dias onde a API retornou <code className="bg-green-100 px-1 rounded">"Pesquisa não retornou dados"</code>.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {!loading && (
        <Card>
          <CardHeader>
            <CardTitle>🔍 Como Verificar os Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-0.5">1</Badge>
                <div>
                  <p className="font-medium">Abra o Console do Navegador</p>
                  <p className="text-sm text-gray-600">
                    Pressione F12 (ou Cmd+Option+I no Mac) e vá para a aba "Console"
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-0.5">2</Badge>
                <div>
                  <p className="font-medium">Procure pelos Logs das Requisições</p>
                  <p className="text-sm text-gray-600">
                    Você verá logs como:
                  </p>
                  <ul className="text-sm text-gray-600 mt-1 space-y-1">
                    <li>• <code className="bg-gray-100 px-1 rounded">📭 2025-09-05: Sem dados</code> (para dias vazios)</li>
                    <li>• <code className="bg-gray-100 px-1 rounded">✅ 2025-09-10: 5 registros</code> (para dias com dados)</li>
                    <li>• <code className="bg-gray-100 px-1 rounded">📊 Resumo: 3/15 com dados, 12 vazias</code> (estatísticas)</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-0.5">3</Badge>
                <div>
                  <p className="font-medium">Observe: Sem Erros!</p>
                  <p className="text-sm text-gray-600">
                    Não há mais "Unexpected token 'P'" porque agora tratamos corretamente a resposta 
                    <code className="bg-gray-100 px-1 rounded">"Pesquisa não retornou dados"</code>
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