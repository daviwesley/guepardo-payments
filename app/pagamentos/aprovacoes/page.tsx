'use client'

import { useRequireAuthOptimized } from '@/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, XCircle, Filter, Search, Eye } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function AprovacoesPage() {
  const { shouldRender } = useRequireAuthOptimized()

  if (!shouldRender) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aprovações</h1>
          <p className="text-muted-foreground">
            Gerencie aprovações de pagamentos e transferências
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              R$ 15.340 aguardando
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas Hoje</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              R$ 42.580 processados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24min</div>
            <p className="text-xs text-muted-foreground">
              Para aprovação
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Solicitações de Aprovação</CardTitle>
              <CardDescription>
                Pagamentos e transferências aguardando aprovação
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar..." className="pl-8 w-64" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: "#APR001",
                tipo: "Transferência",
                solicitante: "Carlos Silva",
                destinatario: "Fornecedor ABC Ltda",
                valor: "R$ 5.500,00",
                motivo: "Pagamento de fornecedor",
                data: "17/09 16:30",
                prioridade: "Alta",
                status: "Pendente"
              },
              {
                id: "#APR002",
                tipo: "PIX",
                solicitante: "Maria Santos",
                destinatario: "João Oliveira",
                valor: "R$ 1.200,00",
                motivo: "Reembolso de despesas",
                data: "17/09 15:45",
                prioridade: "Normal",
                status: "Pendente"
              },
              {
                id: "#APR003",
                tipo: "Boleto",
                solicitante: "Ana Costa",
                destinatario: "Energia Elétrica S.A.",
                valor: "R$ 890,50",
                motivo: "Conta de energia",
                data: "17/09 14:20",
                prioridade: "Normal",
                status: "Aprovado"
              },
              {
                id: "#APR004",
                tipo: "Transferência",
                solicitante: "Pedro Lima",
                destinatario: "Freelancer Design",
                valor: "R$ 2.800,00",
                motivo: "Serviços de design",
                data: "17/09 13:15",
                prioridade: "Baixa",
                status: "Pendente"
              },
              {
                id: "#APR005",
                tipo: "PIX",
                solicitante: "Lucas Ferreira",
                destinatario: "Taxi Express",
                valor: "R$ 45,00",
                motivo: "Corrida de taxi",
                data: "17/09 12:30",
                prioridade: "Normal",
                status: "Rejeitado"
              }
            ].map((solicitacao, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-background border rounded-lg">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <p className="font-medium">{solicitacao.id}</p>
                    <Badge variant="outline">{solicitacao.tipo}</Badge>
                    <Badge variant={
                      solicitacao.prioridade === 'Alta' ? 'destructive' :
                      solicitacao.prioridade === 'Normal' ? 'default' : 'secondary'
                    }>
                      {solicitacao.prioridade}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Solicitante:</span> {solicitacao.solicitante}
                    </div>
                    <div>
                      <span className="font-medium">Destinatário:</span> {solicitacao.destinatario}
                    </div>
                    <div>
                      <span className="font-medium">Motivo:</span> {solicitacao.motivo}
                    </div>
                    <div>
                      <span className="font-medium">Data:</span> {solicitacao.data}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-semibold">{solicitacao.valor}</p>
                    <Badge variant={
                      solicitacao.status === 'Aprovado' ? 'default' :
                      solicitacao.status === 'Pendente' ? 'secondary' : 'destructive'
                    }>
                      {solicitacao.status}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {solicitacao.status === 'Pendente' && (
                      <>
                        <Button size="sm" variant="default">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}