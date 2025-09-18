'use client'

import { useRequireAuthOptimized } from '@/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Receipt, FileText, Plus } from 'lucide-react'

export default function BolecodePage() {
  const { shouldRender } = useRequireAuthOptimized()

  if (!shouldRender) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bolecode</h1>
          <p className="text-muted-foreground">
            Gerencie boletos e códigos de barras para recebimento
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Boleto
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="text-center">
            <Receipt className="h-12 w-12 mx-auto text-primary" />
            <CardTitle>Boletos Emitidos</CardTitle>
            <CardDescription>Total de boletos gerados este mês</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold">47</div>
            <p className="text-sm text-muted-foreground">+12% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <FileText className="h-12 w-12 mx-auto text-green-600" />
            <CardTitle>Boletos Pagos</CardTitle>
            <CardDescription>Quantidade de boletos liquidados</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-green-600">32</div>
            <p className="text-sm text-muted-foreground">68% de conversão</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Receipt className="h-12 w-12 mx-auto text-orange-600" />
            <CardTitle>Pendentes</CardTitle>
            <CardDescription>Boletos aguardando pagamento</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-orange-600">15</div>
            <p className="text-sm text-muted-foreground">32% pendentes</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Boletos Recentes</CardTitle>
          <CardDescription>
            Lista dos últimos boletos emitidos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { codigo: "001234567890", valor: "R$ 450,00", vencimento: "25/09/2025", status: "Pendente" },
              { codigo: "001234567891", valor: "R$ 280,50", vencimento: "20/09/2025", status: "Pago" },
              { codigo: "001234567892", valor: "R$ 150,00", vencimento: "18/09/2025", status: "Vencido" },
              { codigo: "001234567893", valor: "R$ 320,75", vencimento: "15/09/2025", status: "Pago" },
            ].map((boleto, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-background border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">Código: {boleto.codigo}</p>
                  <p className="text-sm text-muted-foreground">Vencimento: {boleto.vencimento}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-semibold">{boleto.valor}</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    boleto.status === 'Pago' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : boleto.status === 'Vencido'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {boleto.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}