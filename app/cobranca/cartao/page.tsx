'use client'

import { useRequireAuthOptimized } from '@/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, Plus, TrendingUp, AlertCircle } from 'lucide-react'

export default function CartaoPage() {
  const { shouldRender } = useRequireAuthOptimized()

  if (!shouldRender) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cartão de Crédito</h1>
          <p className="text-muted-foreground">
            Gerencie cobranças e recebimentos via cartão de crédito
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Cobrança
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas do Mês</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 12.540</div>
            <p className="text-xs text-muted-foreground">
              +20.1% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transações</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +15 transações esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chargebacks</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              -1 em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
            <CardDescription>
              Últimas cobranças processadas via cartão
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "#TXN001", valor: "R$ 250,00", cartao: "**** 4567", status: "Aprovado", data: "17/09 14:32" },
                { id: "#TXN002", valor: "R$ 89,90", cartao: "**** 1234", status: "Aprovado", data: "17/09 13:45" },
                { id: "#TXN003", valor: "R$ 450,00", cartao: "**** 8901", status: "Negado", data: "17/09 12:20" },
                { id: "#TXN004", valor: "R$ 125,50", cartao: "**** 5678", status: "Aprovado", data: "17/09 11:15" },
              ].map((transacao, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{transacao.id}</p>
                    <p className="text-sm text-muted-foreground">{transacao.cartao} • {transacao.data}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-semibold">{transacao.valor}</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      transacao.status === 'Aprovado' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {transacao.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações de Pagamento</CardTitle>
            <CardDescription>
              Configure taxas e limites para cartão de crédito
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Taxa de Processamento</label>
              <p className="text-sm text-muted-foreground">2.9% + R$ 0,30 por transação</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Limite por Transação</label>
              <p className="text-sm text-muted-foreground">R$ 5.000,00</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Limite Diário</label>
              <p className="text-sm text-muted-foreground">R$ 50.000,00</p>
            </div>
            <Button variant="outline" className="w-full">
              Configurar Limites
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}