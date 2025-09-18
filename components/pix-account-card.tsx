import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  QrCode, 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Eye,
  Settings,
  MoreHorizontal
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface PixCharge {
  id: string
  amount: number
  status: string
  created_at: string
  paid_at?: string
  description?: string
  customer_name?: string
  customer_document?: string
}

interface PixAccountCardProps {
  charges: PixCharge[]
  accountName?: string
  bankImage?: string
  bankName?: string
  pixKey?: string
  onViewDetails?: () => void
  onManageAccount?: () => void
}

export function PixAccountCard({ 
  charges, 
  accountName = "Conta Principal",
  bankImage,
  bankName = "Banco",
  pixKey = "***@pixntt.cloud",
  onViewDetails,
  onManageAccount
}: PixAccountCardProps) {
  
  // Calcular estatísticas
  const totalAmount = charges.reduce((sum, charge) => sum + charge.amount, 0)
  const paidCharges = charges.filter(charge => charge.status === 'paid' || charge.paid_at)
  const pendingCharges = charges.filter(charge => charge.status === 'pending')
  const expiredCharges = charges.filter(charge => charge.status === 'expired')
  const cancelledCharges = charges.filter(charge => charge.status === 'cancelled')

  // Função para formatar valor em Real
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100) // API retorna em centavos
  }

  // Calcular percentual de sucesso
  const successRate = charges.length > 0 ? Math.round((paidCharges.length / charges.length) * 100) : 0

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Imagem do banco ou ícone padrão */}
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
              {bankImage ? (
                <img 
                  src={bankImage} 
                  alt={bankName}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Building2 className="h-6 w-6" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">{accountName}</CardTitle>
              <p className="text-sm text-muted-foreground">{bankName}</p>
              <p className="text-xs text-muted-foreground font-mono">{pixKey}</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onViewDetails}>
                <Eye className="mr-2 h-4 w-4" />
                Ver Detalhes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onManageAccount}>
                <Settings className="mr-2 h-4 w-4" />
                Gerenciar Conta
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Valor Total e Taxa de Sucesso */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              {formatCurrency(totalAmount)}
            </div>
            <p className="text-xs text-green-600 dark:text-green-500">Total Recebido</p>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400 flex items-center justify-center gap-1">
              {successRate}%
              {successRate >= 90 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-500">Taxa de Sucesso</p>
          </div>
        </div>

        {/* Estatísticas Detalhadas */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {/* Pagos */}
          <div className="flex items-center justify-between p-2 bg-background border rounded">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Pagos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{paidCharges.length}</span>
              <Badge variant="default" className="text-xs">
                {formatCurrency(paidCharges.reduce((sum, c) => sum + c.amount, 0))}
              </Badge>
            </div>
          </div>

          {/* Pendentes */}
          <div className="flex items-center justify-between p-2 bg-background border rounded">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span>Pendentes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{pendingCharges.length}</span>
              <Badge variant="secondary" className="text-xs">
                {formatCurrency(pendingCharges.reduce((sum, c) => sum + c.amount, 0))}
              </Badge>
            </div>
          </div>

          {/* Expirados */}
          <div className="flex items-center justify-between p-2 bg-background border rounded">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span>Expirados</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{expiredCharges.length}</span>
              <Badge variant="destructive" className="text-xs">
                {formatCurrency(expiredCharges.reduce((sum, c) => sum + c.amount, 0))}
              </Badge>
            </div>
          </div>

          {/* Cancelados */}
          <div className="flex items-center justify-between p-2 bg-background border rounded">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-gray-500" />
              <span>Cancelados</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{cancelledCharges.length}</span>
              <Badge variant="outline" className="text-xs">
                {formatCurrency(cancelledCharges.reduce((sum, c) => sum + c.amount, 0))}
              </Badge>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" className="flex-1" onClick={onViewDetails}>
            <QrCode className="mr-2 h-4 w-4" />
            Ver Transações
          </Button>
          <Button size="sm" className="flex-1">
            <TrendingUp className="mr-2 h-4 w-4" />
            Nova Cobrança
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}