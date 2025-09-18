'use client'

import { useRequireAuthOptimized } from '@/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowUpDown, Plus, Clock, CheckCircle2, AlertTriangle } from 'lucide-react'

export default function TransferenciasPage() {
  const { shouldRender } = useRequireAuthOptimized()

  if (!shouldRender) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transferências</h1>
          <p className="text-muted-foreground">
            Gerencie transferências bancárias e pagamentos
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Transferência
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transferências Hoje</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 8.540</div>
            <p className="text-xs text-muted-foreground">
              12 transferências realizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              R$ 2.340 em processamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processadas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87</div>
            <p className="text-xs text-muted-foreground">
              Esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Erro</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Requer atenção
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Transferências Recentes</CardTitle>
            <CardDescription>
              Últimas movimentações realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { 
                  id: "#TRF001", 
                  destinatario: "João Silva", 
                  banco: "Banco do Brasil",
                  valor: "R$ 1.250,00", 
                  status: "Processada", 
                  data: "17/09 15:30" 
                },
                { 
                  id: "#TRF002", 
                  destinatario: "Maria Santos", 
                  banco: "Itaú",
                  valor: "R$ 850,00", 
                  status: "Pendente", 
                  data: "17/09 14:45" 
                },
                { 
                  id: "#TRF003", 
                  destinatario: "Carlos Oliveira", 
                  banco: "Caixa",
                  valor: "R$ 2.100,00", 
                  status: "Processada", 
                  data: "17/09 13:20" 
                },
                { 
                  id: "#TRF004", 
                  destinatario: "Ana Costa", 
                  banco: "Santander",
                  valor: "R$ 675,50", 
                  status: "Erro", 
                  data: "17/09 12:15" 
                },
              ].map((transferencia, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{transferencia.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {transferencia.destinatario} • {transferencia.banco}
                    </p>
                    <p className="text-xs text-muted-foreground">{transferencia.data}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-semibold">{transferencia.valor}</p>
                    <Badge variant={
                      transferencia.status === 'Processada' ? 'default' :
                      transferencia.status === 'Pendente' ? 'secondary' : 'destructive'
                    }>
                      {transferencia.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações</CardTitle>
            <CardDescription>
              Limites e preferências de transferência
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Limite por Transferência</label>
              <p className="text-sm text-muted-foreground">R$ 10.000,00</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Limite Diário</label>
              <p className="text-sm text-muted-foreground">R$ 50.000,00</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Horário de Processamento</label>
              <p className="text-sm text-muted-foreground">8h às 17h (dias úteis)</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Taxa de Transferência</label>
              <p className="text-sm text-muted-foreground">R$ 3,50 (TED) • Gratuito (PIX)</p>
            </div>
            <Button variant="outline" className="w-full">
              Alterar Configurações
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}